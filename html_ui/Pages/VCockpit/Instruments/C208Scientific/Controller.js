"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/equipment.ts
  var equipment = [
    { key: "LIDAR", circuit: "Scientific_LiDAR", line: "Scientific_LiDAR_Line", label: "LiDAR", watts: 550 },
    { key: "CAMERA", circuit: "Scientific_Camera", line: "Scientific_Camera_Line", label: "Camera", watts: 400 }
  ];
  var local = (key) => `L:C208_SCI_${key}`;
  var named = (variable, component) => `${variable}:'${component}'_n`;
  function specialistAPresent(groups) {
    const sections = groups.reduce((all, group) => all.concat(group.sections), []).filter((section2) => section2.name === "TT:MENU.PAYLOAD.PASSENGER_03");
    if (sections.length !== 1) {
      throw new Error(`Expected one Specialist A payload section (PASSENGER_03); found ${sections.length}`);
    }
    const section = sections[0];
    if (!Number.isFinite(section.occupation) || !Number.isFinite(section.current_mass)) {
      throw new Error("Invalid Specialist A occupancy data");
    }
    return section.occupation > 0 && section.current_mass > 0;
  }
  var Status = {
    Off: 0,
    Powered: 1,
    CrewUnknown: 2,
    CrewMissing: 3,
    SourceMissing: 4,
    BreakerOpen: 5,
    NoPower: 6,
    ControllerError: 8
  };
  var messages = {
    [Status.Off]: "OFF",
    [Status.Powered]: "POWERED",
    [Status.CrewUnknown]: "Crew data unavailable - operation inhibited",
    [Status.CrewMissing]: "Specialist A required at the operator console",
    [Status.SourceMissing]: "Main generator or external ground power required",
    [Status.BreakerOpen]: "Scientific feed or equipment breaker open",
    [Status.NoPower]: "No equipment power - check voltage and connections",
    [Status.ControllerError]: "Aircraft controller error - check simulator console"
  };
  function evaluate(input) {
    const enable = input.requested && input.crewKnown && input.crewPresent && input.sourceAvailable && input.busVoltage >= 20 && input.busVoltage <= 32;
    let status;
    if (!input.requested) status = Status.Off;
    else if (!input.crewKnown) status = Status.CrewUnknown;
    else if (!input.crewPresent) status = Status.CrewMissing;
    else if (!input.sourceAvailable) status = Status.SourceMissing;
    else if (input.feedOpen || input.branchOpen) status = Status.BreakerOpen;
    else if (!enable || !input.circuitOn || input.voltage < 20 || input.voltage > 32 || input.amps <= 0) status = Status.NoPower;
    else status = Status.Powered;
    return { enable, powered: status === Status.Powered, status };
  }

  // src/sim.ts
  function read(name, unit = "number") {
    const value = SimVar.GetSimVarValue(name, unit);
    if (typeof value === "boolean") return Number(value);
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(`Invalid SimVar read: ${name}`);
    }
    return value;
  }
  function write(name, value, unit = "number") {
    return __async(this, null, function* () {
      yield SimVar.SetSimVarValue(name, unit, value);
    });
  }

  // src/Controller.ts
  var C208ScientificController = class extends BaseInstrument {
    constructor() {
      super(...arguments);
      this.crewPresent = false;
      this.crewUpdated = -Infinity;
      this.lastPoll = -Infinity;
      this.polling = false;
      this.updating = false;
      this.lastUpdate = -Infinity;
      this.error = "";
    }
    get templateID() {
      return "C208ScientificController";
    }
    get isInteractive() {
      return false;
    }
    connectedCallback() {
      super.connectedCallback();
      this.listener = RegisterViewListener("JS_LISTENER_MASS_AND_BALANCE", () => {
        var _a;
        (_a = this.listener) == null ? void 0 : _a.on("SEATS_UPDATED", () => {
          this.crewUpdated = -Infinity;
          this.lastPoll = -Infinity;
        });
      });
    }
    isElectricityAvailable() {
      return true;
    }
    Update() {
      super.Update();
      const now = performance.now();
      if (now - this.lastPoll >= 500 && !this.polling && this.listener) {
        this.lastPoll = now;
        void this.pollCrew();
      }
      if (now - this.lastUpdate < 100 || this.updating) return;
      this.lastUpdate = now;
      this.updating = true;
      void this.updateEquipment(now).catch((error) => this.failClosed(error)).then(() => {
        this.updating = false;
      }, (error) => {
        this.report(error);
        this.updating = false;
      });
    }
    pollCrew() {
      return __async(this, null, function* () {
        this.polling = true;
        try {
          const groups = yield this.listener.call("GET_SEATS");
          this.crewPresent = specialistAPresent(groups);
          this.crewUpdated = performance.now();
          this.error = "";
        } catch (error) {
          this.crewUpdated = -Infinity;
          this.report(error);
        } finally {
          this.polling = false;
        }
      });
    }
    report(error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message !== this.error) console.error(`[C208 Scientific Equipment] ${message}`);
      this.error = message;
    }
    failClosed(error) {
      return __async(this, null, function* () {
        this.report(error);
        const operations = [write(local("ERROR"), 1)];
        for (const item of equipment) {
          operations.push(
            write(named("CIRCUIT SWITCH ON", item.circuit), 0, "Bool"),
            write(local(`${item.key}_POWERED`), 0),
            write(local(`${item.key}_STATUS`), Status.ControllerError)
          );
        }
        yield Promise.all(operations.map((operation) => operation.catch((error2) => this.report(error2))));
      });
    }
    updateEquipment(now) {
      return __async(this, null, function* () {
        const crewKnown = now - this.crewUpdated <= 1500;
        const generator = read(named("ELECTRICAL GENERATOR ACTIVE", "StarterGenerator"), "Bool") === 1 && read(named("ELECTRICAL GENERATOR SWITCH", "StarterGenerator"), "Bool") === 1 && read(named("LINE CONNECTION ON", "StarterGenerator_To_PWR_BUS_DISTRIB"), "Bool") === 1 && read(named("LINE BREAKER PULLED", "StarterGenerator_To_PWR_BUS_DISTRIB"), "Bool") === 0 && read(named("ELECTRICAL GENERATOR VOLTAGE", "StarterGenerator"), "volts") >= 20;
        const external = read(named("EXTERNAL POWER AVAILABLE", "ExternalPower"), "Bool") === 1 && read(named("EXTERNAL POWER ON", "ExternalPower"), "Bool") === 1 && read(named("EXTERNAL POWER CONNECTION ON", "ExternalPower"), "Bool") === 1 && read(named("ELECTRICAL EXTERNAL POWER VOLTAGE", "ExternalPower"), "volts") >= 20;
        const feedOpen = read(named("LINE BREAKER PULLED", "Scientific_Feed"), "Bool") === 1;
        const busVoltage = read(named("ELECTRICAL BUS VOLTAGE", "Scientific_Equipment_Bus"), "volts");
        yield write(local("CREW_KNOWN"), Number(crewKnown));
        yield write(local("CREW_PRESENT"), Number(crewKnown && this.crewPresent));
        yield write(local("SOURCE_AVAILABLE"), Number(generator || external));
        yield write(local("ERROR"), Number(!crewKnown && this.error !== ""));
        for (const item of equipment) {
          const result = evaluate({
            requested: read(local(`${item.key}_REQUESTED`)) === 1,
            crewKnown,
            crewPresent: this.crewPresent,
            sourceAvailable: generator || external,
            busVoltage,
            feedOpen,
            branchOpen: read(named("LINE BREAKER PULLED", item.line), "Bool") === 1,
            voltage: read(named("ELECTRICAL CIRCUIT VOLTAGE", item.circuit), "volts"),
            circuitOn: read(named("CIRCUIT ON", item.circuit), "Bool") === 1,
            amps: read(named("ELECTRICAL CIRCUIT AMPS", item.circuit), "amperes")
          });
          if (read(named("CIRCUIT SWITCH ON", item.circuit), "Bool") !== Number(result.enable)) {
            yield write(named("CIRCUIT SWITCH ON", item.circuit), Number(result.enable), "Bool");
          }
          yield write(local(`${item.key}_POWERED`), Number(result.powered));
          yield write(local(`${item.key}_STATUS`), result.status);
        }
        yield write(local("HEARTBEAT"), now);
      });
    }
  };
  registerInstrument("c208-scientific-controller", C208ScientificController);
})();
