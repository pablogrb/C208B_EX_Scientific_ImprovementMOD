"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value2) => {
        try {
          step(generator.next(value2));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value2) => {
        try {
          step(generator.throw(value2));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // simulator-sdk:msfssdk
  var require_msfssdk = __commonJS({
    "simulator-sdk:msfssdk"(exports, module) {
      module.exports = msfssdk;
    }
  });

  // node_modules/@microsoft/msfs-efb-api/index.js
  var import_msfs_sdk = __toESM(require_msfssdk());
  var __defProp2 = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value2) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp2.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var AppBootMode = /* @__PURE__ */ ((AppBootMode2) => {
    AppBootMode2[AppBootMode2["COLD"] = 0] = "COLD";
    AppBootMode2[AppBootMode2["WARM"] = 1] = "WARM";
    AppBootMode2[AppBootMode2["HOT"] = 2] = "HOT";
    return AppBootMode2;
  })(AppBootMode || {});
  var AppSuspendMode = /* @__PURE__ */ ((AppSuspendMode2) => {
    AppSuspendMode2[AppSuspendMode2["SLEEP"] = 0] = "SLEEP";
    AppSuspendMode2[AppSuspendMode2["TERMINATE"] = 1] = "TERMINATE";
    return AppSuspendMode2;
  })(AppSuspendMode || {});
  var App = class {
    constructor() {
      this._isInstalled = false;
      this._isReady = false;
      this._favoriteIndex = -1;
      this.available = import_msfs_sdk.Subject.create(true);
      this.BootMode = AppBootMode.COLD;
      this.SuspendMode = AppSuspendMode.SLEEP;
    }
    /**
     * @param props
     * @internal
     */
    _install(props) {
      return __async(this, null, function* () {
        var _a;
        if (this._isInstalled) {
          return Promise.reject("App already installed.");
        }
        this._isInstalled = true;
        this.bus = props.bus;
        this._unitsSettingsManager = props.unitsSettingManager;
        this._efbSettingsManager = props.efbSettingsManager;
        this._notificationManager = props.notificationManager;
        this._onboardingManager = props.onboardingManager;
        this._favoriteIndex = (_a = props.favoriteIndex) != null ? _a : -1;
        this.options = props.options;
        yield this.install(props);
        this._isReady = true;
        Coherent.trigger("EFB_APP_INSTALLED", this.name, this.internalName);
        return Promise.resolve();
      });
    }
    /**
     * Install hook
     * @param props
     */
    install(props) {
      return __async(this, null, function* () {
        return Promise.resolve();
      });
    }
    /** Boolean to check if app is loaded and installed. */
    get isReady() {
      return this._isReady;
    }
    /**
     * Internal app name
     * @defaultValue > Class's name (`this.constructor.name`)
     */
    get internalName() {
      return this.constructor.name;
    }
    /**
     * EFB units settings manager
     * @returns a unique unitsSettingsManager instance
     */
    get unitsSettingsManager() {
      const unitsSettingsManager = this._unitsSettingsManager;
      if (!unitsSettingsManager) {
        throw new Error("Units settings manager is not defined");
      }
      return unitsSettingsManager;
    }
    /**
     * EFB settings manager
     * @returns a unique efbSettingsManager instance
     */
    get efbSettingsManager() {
      const efbSettingsManager = this._efbSettingsManager;
      if (!efbSettingsManager) {
        throw new Error("EFB settings manager is not defined");
      }
      return efbSettingsManager;
    }
    /**
     * EFB notification manager
     * @returns a unique efbNotificationManager instance
     */
    get notificationManager() {
      const notificationManager = this._notificationManager;
      if (!notificationManager) {
        throw new Error("Notification manager is not defined");
      }
      return notificationManager;
    }
    /** Onboarding manager */
    get onboardingManager() {
      const onboardingManager = this._onboardingManager;
      if (!onboardingManager) {
        throw new Error("Onboarding manager is not defined");
      }
      return onboardingManager;
    }
    /**
     * Aircraft models list compatible with the App. If not defined, the App is compatible with all aircraft models.
     * example: ['Cabri G2', 'H125']
     * @returns a list of aircraft models compatible with the App or undefined
     */
    get compatibleAircraftModels() {
      return void 0;
    }
    /** @internal */
    get favoriteIndex() {
      return this._favoriteIndex;
    }
    /** @internal */
    set favoriteIndex(index2) {
      this._favoriteIndex = index2;
    }
  };
  function isVNode(object) {
    return "instance" in object && "props" in object && "children" in object;
  }
  function toClassProp(classProp) {
    if (classProp === void 0) {
      return classProp;
    }
    if (Array.isArray(classProp)) {
      return toClassProp(classProp.join(" "));
    }
    if (typeof classProp !== "string") {
      return classProp;
    }
    return classProp.split(" ").reduce(function(stack, el) {
      return __spreadProps(__spreadValues({}, stack), { [el]: true });
    }, {});
  }
  function mergeClassProp(baseProp, ...args) {
    const mergedClassProp = Object.assign({}, toClassProp(baseProp));
    for (const arg of args) {
      Object.assign(mergedClassProp, toClassProp(arg));
    }
    return mergedClassProp;
  }
  function where(value2) {
    return (input) => value2 === input;
  }
  function toString() {
    return (input) => input.toString();
  }
  var _FlightPhaseManager = class __FlightPhaseManager {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
      this._flightPhase = import_msfs_sdk.Subject.create(
        100
        /* UNKNOWN */
      );
      this.flightPhase = this._flightPhase;
      this.isFlightOver = this._flightPhase.map(where(
        11
        /* FLIGHT_OVER */
      ));
      this.onFlightPhaseStateChangedSubscription = null;
    }
    /**
     * Static singleton instance of the Flight Phase Manager
     * @internal
     */
    static get instance() {
      return window.FLIGHT_PHASE_MANAGER = __FlightPhaseManager._instance = window.FLIGHT_PHASE_MANAGER || __FlightPhaseManager._instance || new __FlightPhaseManager();
    }
    /**
     * The bus is set once at EFB initialization from efb_ui.tsx
     * @internal
     */
    setBus(bus) {
      var _a;
      (_a = this.onFlightPhaseStateChangedSubscription) == null ? void 0 : _a.destroy();
      this.onFlightPhaseStateChangedSubscription = bus.on("FlightPhaseChanged", (flightPhase) => {
        switch (flightPhase) {
          case "PREFLIGHT_RTC":
          case "PREFLIGHT":
          case "SKIP_TRANSITION_PREFLIGHT":
            this._flightPhase.set(
              0
              /* PREFLIGHT */
            );
            break;
          case "STARTUP":
            this._flightPhase.set(
              1
              /* STARTUP */
            );
            break;
          case "BEFORE_TAXI":
          case "TAXI":
          case "SKIP_TRANSITION_TAXI":
            this._flightPhase.set(
              3
              /* TAXI */
            );
            break;
          case "TAKEOFF":
            this._flightPhase.set(
              4
              /* TAKEOFF */
            );
            break;
          case "CLIMB":
            this._flightPhase.set(
              5
              /* CLIMB */
            );
            break;
          case "CRUISE":
          case "SKIP_TRANSITION_CRUISE":
            this._flightPhase.set(
              6
              /* CRUISE */
            );
            break;
          case "DESCENT":
            this._flightPhase.set(
              7
              /* DESCENT */
            );
            break;
          case "LANDING":
            this._flightPhase.set(
              8
              /* LANDING */
            );
            break;
          case "TAXITOGATE":
          case "SKIP_TRANSITION_TAXITOGATE":
            this._flightPhase.set(
              9
              /* TAXITOGATE */
            );
            break;
          case "SHUTDOWN":
            this._flightPhase.set(
              10
              /* SHUTDOWN */
            );
            break;
          case "RTC":
            break;
          case "MISSIONSUCCESS":
          case "MISSIONABORTED":
            this._flightPhase.set(
              11
              /* FLIGHT_OVER */
            );
            break;
          case "REACH BANNER APPROACH":
          case "HOOKBANNER":
          case "REACH PASS":
          case "PASS":
          case "CRUISEBACK":
          case "REACH DROP":
          case "DROP BANNER":
            break;
          case "WATERDROP":
            break;
          default:
            console.warn(`Received unknown flight phase '${flightPhase}'`);
            this._flightPhase.set(
              100
              /* UNKNOWN */
            );
        }
      });
    }
    /**
     * @description This function is used in order to verify if a given flight phase has been reached.
     * Always return true when the flight phase is unknown.
     * @param flightPhase The flight phase that has been reached or not
     * @returns A subscribable that returns whether the given flight phase has been reached
     */
    hasReachedFlightPhaseState(flightPhase) {
      return this.flightPhase.map(
        (currentFlightPhaseState) => currentFlightPhaseState >= flightPhase
      );
    }
  };
  var FlightPhaseManager = _FlightPhaseManager.instance;
  var _GameModeManager = class __GameModeManager {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
      this._gameMode = import_msfs_sdk.Subject.create(
        0
        /* UNKNOWN */
      );
      this.gameMode = this._gameMode;
      this.isCareer = this._gameMode.map(where(
        1
        /* CAREER */
      ));
      this.isChallenge = this._gameMode.map(where(
        2
        /* CHALLENGE */
      ));
      this.isDiscovery = this._gameMode.map(where(
        3
        /* DISCOVERY */
      ));
      this.isFreeflight = this._gameMode.map(where(
        4
        /* FREEFLIGHT */
      ));
      this.onGameModeChangedSubscription = null;
    }
    /**
     * Static singleton instance of the Game mode manager
     * @internal
     */
    static get instance() {
      return window.GAME_MODE_MANAGER = __GameModeManager._instance = window.GAME_MODE_MANAGER || __GameModeManager._instance || new __GameModeManager();
    }
    /**
     * The bus is set once at EFB initialization from efb_ui.tsx
     * @internal
     */
    setBus(bus) {
      var _a;
      (_a = this.onGameModeChangedSubscription) == null ? void 0 : _a.destroy();
      this.onGameModeChangedSubscription = bus.on("GameModeChanged", (gameMode) => {
        switch (gameMode) {
          case "":
            this._gameMode.set(
              0
              /* UNKNOWN */
            );
            break;
          case "CAREER GAMEMODE":
            this._gameMode.set(
              1
              /* CAREER */
            );
            break;
          case "CHALLENGE GAMEMODE":
            this._gameMode.set(
              2
              /* CHALLENGE */
            );
            break;
          case "DISCOVERY GAMEMODE":
            this._gameMode.set(
              3
              /* DISCOVERY */
            );
            break;
          case "FREEFLIGHT GAMEMODE":
            this._gameMode.set(
              4
              /* FREEFLIGHT */
            );
            break;
          default:
            console.error(`Unknown game mode '${gameMode}'`);
            this._gameMode.set(
              0
              /* UNKNOWN */
            );
        }
      });
    }
  };
  var GameModeManager = _GameModeManager.instance;
  Blob.prototype.arrayBuffer = function() {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
        var _a;
        const arrayBuffer = (_a = event.target) == null ? void 0 : _a.result;
        if (typeof arrayBuffer === "string" || arrayBuffer === null || arrayBuffer === void 0) {
          reject("ArrayBuffer is null");
          return;
        }
        resolve(arrayBuffer);
      };
      fileReader.readAsArrayBuffer(this);
      fileReader.result;
    });
  };
  var uint8 = new Uint8Array(4);
  var uint32 = new Uint32Array(uint8.buffer);
  function isPromise(value2) {
    return value2 instanceof Promise;
  }
  function toPromise(value2) {
    return isPromise(value2) ? value2 : Promise.resolve(value2);
  }
  function checkUserSetting(setting, type) {
    if (!Object.values(type).includes(setting.get())) {
      setting.resetToDefault();
    }
  }
  var basicFormatter = import_msfs_sdk.NumberFormatter.create({
    maxDigits: 0,
    forceDecimalZeroes: false,
    nanString: "-"
  });
  var _UnitFormatter = class _UnitFormatter2 {
    /**
     * Creates a function which formats measurement units to strings representing their abbreviated names.
     * @param defaultString The string to output when the input unit cannot be formatted. Defaults to the empty string.
     * @param charCase The case to enforce on the output string. Defaults to `'normal'`.
     * @returns A function which formats measurement units to strings representing their abbreviated names.
     */
    static create(defaultString = "", charCase = "normal") {
      var _a, _b;
      switch (charCase) {
        case "upper":
          (_a = _UnitFormatter2.UNIT_TEXT_UPPER) != null ? _a : _UnitFormatter2.UNIT_TEXT_UPPER = _UnitFormatter2.createUpperCase();
          return (unit) => {
            var _a2, _b2;
            return (
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              (_b2 = (_a2 = _UnitFormatter2.UNIT_TEXT_UPPER[unit.family]) == null ? void 0 : _a2[unit.name]) != null ? _b2 : defaultString
            );
          };
        case "lower":
          (_b = _UnitFormatter2.UNIT_TEXT_LOWER) != null ? _b : _UnitFormatter2.UNIT_TEXT_LOWER = _UnitFormatter2.createLowerCase();
          return (unit) => {
            var _a2, _b2;
            return (
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              (_b2 = (_a2 = _UnitFormatter2.UNIT_TEXT_LOWER[unit.family]) == null ? void 0 : _a2[unit.name]) != null ? _b2 : defaultString
            );
          };
        default:
          return (unit) => {
            var _a2, _b2;
            return (_b2 = (_a2 = _UnitFormatter2.UNIT_TEXT[unit.family]) == null ? void 0 : _a2[unit.name]) != null ? _b2 : defaultString;
          };
      }
    }
    /**
     * Creates a record of lowercase unit abbreviated names.
     * @returns A record of lowercase unit abbreviated names.
     */
    static createLowerCase() {
      const lower = {};
      for (const family in _UnitFormatter2.UNIT_TEXT) {
        const familyText = _UnitFormatter2.UNIT_TEXT[family];
        lower[family] = {};
        for (const unit in familyText) {
          lower[family][unit] = familyText[unit].toLowerCase();
        }
      }
      return lower;
    }
    /**
     * Creates a record of uppercase unit abbreviated names.
     * @returns A record of uppercase unit abbreviated names.
     */
    static createUpperCase() {
      const upper = {};
      for (const family in _UnitFormatter2.UNIT_TEXT) {
        const familyText = _UnitFormatter2.UNIT_TEXT[family];
        upper[family] = {};
        for (const unit in familyText) {
          upper[family][unit] = familyText[unit].toUpperCase();
        }
      }
      return upper;
    }
    /**
     * Gets a mapping of unit family and name to text used by UnitFormatter to format units. The returned object maps
     * unit families to objects that map unit names within each family to formatted text.
     * @returns A mapping of unit family and name to text used by UnitFormatter to format units.
     */
    static getUnitTextMap() {
      return _UnitFormatter2.UNIT_TEXT;
    }
  };
  _UnitFormatter.UNIT_TEXT = {
    [import_msfs_sdk.UnitFamily.Distance]: {
      [import_msfs_sdk.UnitType.METER.name]: "M",
      [import_msfs_sdk.UnitType.FOOT.name]: "FT",
      [import_msfs_sdk.UnitType.KILOMETER.name]: "KM",
      [import_msfs_sdk.UnitType.NMILE.name]: "NM",
      [import_msfs_sdk.UnitType.MILE.name]: "SM"
    },
    [import_msfs_sdk.UnitFamily.Angle]: {
      [import_msfs_sdk.UnitType.DEGREE.name]: "\xB0",
      [import_msfs_sdk.UnitType.RADIAN.name]: "rad"
    },
    [import_msfs_sdk.UnitFamily.Duration]: {
      [import_msfs_sdk.UnitType.SECOND.name]: "SEC",
      [import_msfs_sdk.UnitType.MINUTE.name]: "MIN",
      [import_msfs_sdk.UnitType.HOUR.name]: "HR"
    },
    [import_msfs_sdk.UnitFamily.Weight]: {
      [import_msfs_sdk.UnitType.KILOGRAM.name]: "KG",
      [import_msfs_sdk.UnitType.POUND.name]: "LBS",
      [import_msfs_sdk.UnitType.LITER_FUEL.name]: "LT",
      [import_msfs_sdk.UnitType.GALLON_FUEL.name]: "GAL",
      [import_msfs_sdk.UnitType.IMP_GALLON_FUEL.name]: "IG"
    },
    [import_msfs_sdk.UnitFamily.Volume]: {
      [import_msfs_sdk.UnitType.LITER.name]: "L",
      [import_msfs_sdk.UnitType.GALLON.name]: "GAL"
    },
    [import_msfs_sdk.UnitFamily.Pressure]: {
      [import_msfs_sdk.UnitType.HPA.name]: "HPA",
      [import_msfs_sdk.UnitType.IN_HG.name]: "IN"
    },
    [import_msfs_sdk.UnitFamily.Temperature]: {
      [import_msfs_sdk.UnitType.CELSIUS.name]: "\xB0C",
      [import_msfs_sdk.UnitType.FAHRENHEIT.name]: "\xB0F"
    },
    [import_msfs_sdk.UnitFamily.TemperatureDelta]: {
      [import_msfs_sdk.UnitType.DELTA_CELSIUS.name]: "\xB0C",
      [import_msfs_sdk.UnitType.DELTA_FAHRENHEIT.name]: "\xB0F"
    },
    [import_msfs_sdk.UnitFamily.Speed]: {
      [import_msfs_sdk.UnitType.KNOT.name]: "KT",
      [import_msfs_sdk.UnitType.KPH.name]: "KM/H",
      [import_msfs_sdk.UnitType.MPM.name]: "MPM",
      [import_msfs_sdk.UnitType.FPM.name]: "FPM"
    },
    [import_msfs_sdk.UnitFamily.WeightFlux]: {
      [import_msfs_sdk.UnitType.KGH.name]: "KG/HR",
      [import_msfs_sdk.UnitType.PPH.name]: "LB/HR",
      [import_msfs_sdk.UnitType.LPH_FUEL.name]: "LT/HR",
      [import_msfs_sdk.UnitType.GPH_FUEL.name]: "GAL/HR",
      [import_msfs_sdk.UnitType.IGPH_FUEL.name]: "IG/HR"
    }
  };
  var UnitFormatter = _UnitFormatter;
  function value(arg) {
    return typeof arg === "function" ? arg() : arg;
  }
  var AppContainer = class extends import_msfs_sdk.DisplayComponent {
    constructor() {
      super(...arguments);
      this.appMainRef = import_msfs_sdk.FSComponent.createRef();
      this.appStackRef = import_msfs_sdk.FSComponent.createRef();
    }
    onAfterRender(node) {
      super.onAfterRender(node);
      this.props.appViewService.onAppContainerRendered(this.appStackRef.instance);
    }
    render() {
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("div", { ref: this.appMainRef, class: `app-container` }, /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(DefaultAppViewStackContainer, { ref: this.appStackRef }));
    }
  };
  var DefaultAppViewStackContainer = class extends import_msfs_sdk.DisplayComponent {
    constructor() {
      super(...arguments);
      this.rootRef = import_msfs_sdk.FSComponent.createRef();
    }
    renderView(view) {
      import_msfs_sdk.FSComponent.render(view, this.rootRef.instance);
    }
    render() {
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("div", { ref: this.rootRef, class: mergeClassProp("app-view-stack", this.props.class) });
    }
  };
  function Memoize(args) {
    let hashFunction;
    let duration;
    let tags;
    {
      hashFunction = args;
    }
    return (target, propertyKey, descriptor) => {
      if (descriptor.value != null) {
        descriptor.value = getNewFunction(descriptor.value, hashFunction, duration, tags);
      } else if (descriptor.get != null) {
        descriptor.get = getNewFunction(descriptor.get, hashFunction, duration, tags);
      } else {
        throw "Only put a Memoize() decorator on a method or get accessor.";
      }
    };
  }
  var clearCacheTagsMap = /* @__PURE__ */ new Map();
  function getNewFunction(originalMethod, hashFunction, duration = 0, tags) {
    const propMapName = /* @__PURE__ */ Symbol(`__memoized_map__`);
    return function(...args) {
      let returnedValue;
      if (!this.hasOwnProperty(propMapName)) {
        Object.defineProperty(this, propMapName, {
          configurable: false,
          enumerable: false,
          writable: false,
          value: /* @__PURE__ */ new Map()
        });
      }
      let myMap = this[propMapName];
      if (Array.isArray(tags)) {
        for (const tag of tags) {
          if (clearCacheTagsMap.has(tag)) {
            clearCacheTagsMap.get(tag).push(myMap);
          } else {
            clearCacheTagsMap.set(tag, [myMap]);
          }
        }
      }
      if (hashFunction || args.length > 0 || duration > 0) {
        let hashKey;
        if (hashFunction === true) {
          hashKey = args.map((a) => a.toString()).join("!");
        } else if (hashFunction) {
          hashKey = hashFunction.apply(this, args);
        } else {
          hashKey = args[0];
        }
        const timestampKey = `${hashKey}__timestamp`;
        let isExpired = false;
        if (duration > 0) {
          if (!myMap.has(timestampKey)) {
            isExpired = true;
          } else {
            let timestamp = myMap.get(timestampKey);
            isExpired = Date.now() - timestamp > duration;
          }
        }
        if (myMap.has(hashKey) && !isExpired) {
          returnedValue = myMap.get(hashKey);
        } else {
          returnedValue = originalMethod.apply(this, args);
          myMap.set(hashKey, returnedValue);
          if (duration > 0) {
            myMap.set(timestampKey, Date.now());
          }
        }
      } else {
        const hashKey = this;
        if (myMap.has(hashKey)) {
          returnedValue = myMap.get(hashKey);
        } else {
          returnedValue = originalMethod.apply(this, args);
          myMap.set(hashKey, returnedValue);
        }
      }
      return returnedValue;
    };
  }
  var GamepadEvents = /* @__PURE__ */ ((GamepadEvents2) => {
    GamepadEvents2["JOYSTICK_LEFT_X_AXIS"] = "JOYSTICK_LEFT_X_AXIS";
    GamepadEvents2["JOYSTICK_LEFT_Y_AXIS"] = "JOYSTICK_LEFT_Y_AXIS";
    GamepadEvents2["JOYSTICK_RIGHT_X_AXIS"] = "JOYSTICK_RIGHT_X_AXIS";
    GamepadEvents2["JOYSTICK_RIGHT_Y_AXIS"] = "JOYSTICK_RIGH_Y_AXIS";
    GamepadEvents2["BUTTON_A"] = "BUTTON_A";
    GamepadEvents2["BUTTON_B"] = "BUTTON_B";
    GamepadEvents2["BUTTON_Y"] = "BUTTON_Y";
    GamepadEvents2["BUTTON_X"] = "BUTTON_X";
    GamepadEvents2["JOYDIR_LEFT"] = "JOYDIR_LEFT";
    GamepadEvents2["JOYDIR_RIGHT"] = "JOYDIR_RIGHT";
    GamepadEvents2["JOYDIR_UP"] = "JOYDIR_UP";
    GamepadEvents2["JOYDIR_DOWN"] = "JOYDIR_DOWN";
    return GamepadEvents2;
  })(GamepadEvents || {});
  var _InputsListener = class _InputsListener2 extends ViewListener.ViewListener {
    static addInputChangeCallback(context, action, callback) {
      const idWatcher = "InputWatcher_" + context + "_" + action + "_" + import_msfs_sdk.UUID.GenerateUuid();
      _InputsListener2.inputsListener.trigger("ADD_INPUT_WATCHER", idWatcher, context, action);
      _InputsListener2.inputsListener.on("InputListener.InputChange", (id, down) => {
        if (id === idWatcher) {
          callback(down);
        }
      });
      return idWatcher;
    }
    static removeInputChangeCallback(id) {
      _InputsListener2.inputsListener.trigger("REMOVE_INPUT_WATCHER", id);
    }
  };
  _InputsListener.isLoaded = import_msfs_sdk.Subject.create(false);
  _InputsListener.inputsListener = RegisterViewListener(
    "JS_LISTENER_INPUTS",
    () => _InputsListener.isLoaded.set(true)
  );
  var InputsListener = _InputsListener;
  var _GamepadUiComponent = class _GamepadUiComponent2 extends import_msfs_sdk.DisplayComponent {
    constructor() {
      var _a, _b;
      super(...arguments);
      this._gamepadUiSubs = [];
      this.gamepadUiComponentRef = import_msfs_sdk.FSComponent.createRef();
      this._nextHandler = import_msfs_sdk.Subject.create(void 0);
      this.nextHandler = this._nextHandler;
      this.disabled = import_msfs_sdk.SubscribableUtils.toSubscribable((_a = this.props.disabled) != null ? _a : false, true);
      this.visible = import_msfs_sdk.SubscribableUtils.toSubscribable((_b = this.props.visible) != null ? _b : true, true);
      this.componentClickListener = this.handleComponentClick.bind(this);
    }
    setNextGamepadEventHandler(ref) {
      this._nextHandler.set(ref);
    }
    deletePreviousGamepadEventHandler() {
      throw new Error("Method not implemented.");
    }
    handleGamepadEvent(gamepadEvent) {
      console.log(`Received ${gamepadEvent} in handleMoveEvent`);
    }
    onAfterRender(node) {
      super.onAfterRender(node);
      const classes = mergeClassProp(this.props.class);
      Object.keys(classes).forEach((className) => {
        const subscribable = import_msfs_sdk.SubscribableUtils.toSubscribable(classes[className], true);
        this._gamepadUiSubs.push(
          subscribable.sub((value2) => {
            this.gamepadUiComponentRef.instance.classList.toggle(className, value2);
          }, true)
        );
      });
      this._gamepadUiSubs.push(
        this.visible.sub((isVisible) => {
          this.gamepadUiComponentRef.instance.hidden = !isVisible;
        }, true)
      );
      if (import_msfs_sdk.SubscribableUtils.isSubscribable(this.props.disabled)) {
        this._gamepadUiSubs.push(
          this.props.disabled.sub((disabled) => {
            disabled ? this.disable() : this.enable();
          }, true)
        );
      } else {
        this.props.disabled ? this.disable() : this.enable();
      }
      window.addEventListener("click", this.componentClickListener);
      if (this.props.onboardingStepId === void 0) {
        return;
      }
      this.gamepadUiComponentRef.instance.setAttribute("id", this.props.onboardingStepId);
    }
    handleComponentClick(e) {
      if (!this.gamepadUiComponentRef.instance.contains(e.target)) {
        this.onClickOutOfComponent(e);
      }
    }
    onButtonAPressed() {
      if (this.props.onButtonAPressed !== void 0) {
        this.props.onButtonAPressed();
      }
    }
    onButtonBPressed() {
      if (this.props.onButtonBPressed !== void 0) {
        this.props.onButtonBPressed();
      }
    }
    onClickOutOfComponent(_e) {
      return;
    }
    enable() {
      this.gamepadUiComponentRef.instance.removeAttribute("disabled");
    }
    disable() {
      this.gamepadUiComponentRef.instance.setAttribute("disabled", "");
    }
    show() {
      this.gamepadUiComponentRef.instance.style.visibility = "visible";
    }
    hide() {
      this.gamepadUiComponentRef.instance.style.visibility = "hidden";
    }
    toggleFocus(value2) {
      if (value2 !== void 0) {
        if (value2 === true) {
          this.gamepadUiComponentRef.instance.classList.add(_GamepadUiComponent2.FOCUS_CLASS);
        } else {
          this.gamepadUiComponentRef.instance.classList.remove(_GamepadUiComponent2.FOCUS_CLASS);
        }
        return;
      }
      this.gamepadUiComponentRef.instance.classList.toggle(_GamepadUiComponent2.FOCUS_CLASS);
    }
    getComponentRect() {
      return this.gamepadUiComponentRef.instance.getBoundingClientRect();
    }
    destroy() {
      this._gamepadUiSubs.forEach((s) => s.destroy());
      window.removeEventListener("click", this.componentClickListener);
      super.destroy();
    }
  };
  _GamepadUiComponent.FOCUS_CLASS = "focus";
  var GamepadUiComponent = _GamepadUiComponent;
  var GamepadUiParser = class {
    constructor() {
      this.gamepadUiViewVNode = null;
    }
    /** On veut focus le premier élément */
    bindVNodeReference(gamepadUiViewVNode) {
      this.gamepadUiViewVNode = gamepadUiViewVNode;
      this.focusFirstElement();
    }
    focusFirstElement() {
      if (this.currentElement = this.findFirstElement()) {
        this.currentElement.instance.toggleFocus(true);
      }
    }
    goUp() {
      this.goDir("UP");
    }
    goRight() {
      this.goDir("RIGHT");
    }
    goDown() {
      this.goDir("DOWN");
    }
    goLeft() {
      this.goDir("LEFT");
    }
    pushButtonA() {
      var _a;
      (_a = this.currentElement) == null ? void 0 : _a.instance.onButtonAPressed();
    }
    pushButtonB() {
      var _a;
      (_a = this.currentElement) == null ? void 0 : _a.instance.onButtonBPressed();
    }
    goDir(dir) {
      const HTMLElementList = this.parseDOM();
      if (!this.currentElement || HTMLElementList === null) {
        return;
      }
      const nextElement = this.findClosestNode(this.currentElement, HTMLElementList, dir);
      if (nextElement !== null) {
        this.currentElement.instance.toggleFocus(false);
        this.currentElement = nextElement;
        this.currentElement.instance.toggleFocus(true);
      }
    }
    parseDOM() {
      if (this.gamepadUiViewVNode === null) {
        throw new Error(`Can't parse DOM, VNode is null`);
      }
      const VNodeList = [];
      import_msfs_sdk.FSComponent.visitNodes(this.gamepadUiViewVNode, (node) => {
        if (node.instance instanceof GamepadUiComponent) {
          const ref = import_msfs_sdk.FSComponent.createRef();
          ref.instance = node.instance;
          VNodeList.push(ref);
        }
        return false;
      });
      return VNodeList.length ? VNodeList : null;
    }
    findFirstElement() {
      const HTMLElementList = this.parseDOM();
      if (HTMLElementList === null) {
        return null;
      }
      return HTMLElementList[0];
    }
    /** On réduit la liste dont le top est en dessous du bottom du current node. */
    findClosestNode(currentGamepadUiComponent, gamepadUiComponentList, direction) {
      let candidateIndex = -1;
      switch (direction) {
        case "UP":
          candidateIndex = this.findBestCandidate(
            currentGamepadUiComponent,
            gamepadUiComponentList,
            "bottom",
            "top"
          );
          break;
        case "RIGHT":
          candidateIndex = this.findBestCandidate(
            currentGamepadUiComponent,
            gamepadUiComponentList,
            "left",
            "right"
          );
          break;
        case "DOWN":
          candidateIndex = this.findBestCandidate(
            currentGamepadUiComponent,
            gamepadUiComponentList,
            "top",
            "bottom"
          );
          break;
        case "LEFT":
          candidateIndex = this.findBestCandidate(
            currentGamepadUiComponent,
            gamepadUiComponentList,
            "right",
            "left"
          );
          break;
      }
      if (candidateIndex !== -1 && candidateIndex < gamepadUiComponentList.length) {
        return gamepadUiComponentList[candidateIndex];
      }
      return null;
    }
    findBestCandidate(currentGamepadUiComponent, gamepadUiComponentList, side1, side2) {
      const htmlElementCandidates = [];
      let closestDistance = Infinity;
      let candidateIndex = -1;
      const currentHTMLElementRect = currentGamepadUiComponent.instance.getComponentRect();
      gamepadUiComponentList.forEach((htmlElement, index2) => {
        const htmlElementRect = htmlElement.instance.getComponentRect();
        if (this.isRectPosValid(htmlElementRect, currentHTMLElementRect, side1, side2, false)) {
          if (!htmlElementCandidates.some(
            (htmlElementCandidate) => this.isRectPosValid(
              htmlElementRect,
              htmlElementCandidate.instance.getComponentRect(),
              side1,
              side1,
              true
            )
          )) {
            htmlElementCandidates.push(htmlElement);
            const corner = side1 === "bottom" || side1 === "top" ? "left" : "top";
            const distance = this.distances1D(htmlElementRect, currentHTMLElementRect, corner);
            if (distance <= closestDistance) {
              closestDistance = distance;
              candidateIndex = index2;
            }
          }
        }
      });
      return candidateIndex;
    }
    isRectPosValid(rect1, rect2, side1, side2, strict) {
      if (side1 === "bottom" || side1 === "right") {
        if (strict) {
          return rect1[side1] < rect2[side2];
        } else {
          return rect1[side1] <= rect2[side2];
        }
      } else {
        if (strict) {
          return rect1[side1] > rect2[side2];
        } else {
          return rect1[side1] >= rect2[side2];
        }
      }
    }
    distances1D(rect1, rect2, side) {
      return Math.abs(rect2[side] - rect1[side]);
    }
  };
  var UiView = class extends import_msfs_sdk.DisplayComponent {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpen() {
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose() {
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onResume() {
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onPause() {
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    onUpdate(time) {
    }
    destroy() {
      super.destroy();
    }
  };
  var GamepadUiView = class extends UiView {
    constructor() {
      super(...arguments);
      this.gamepadUiViewRef = import_msfs_sdk.FSComponent.createRef();
      this.gamepadUiParser = new GamepadUiParser();
      this._nextHandler = import_msfs_sdk.Subject.create(void 0);
      this.nextHandler = this._nextHandler;
    }
    onAfterRender(node) {
      super.onAfterRender(node);
      this.gamepadUiParser.bindVNodeReference(node);
    }
    setNextGamepadEventHandler(ref) {
      this._nextHandler.set(ref);
    }
    deletePreviousGamepadEventHandler() {
      this._nextHandler.set(void 0);
    }
    handleGamepadEvent(_gamepadEvent) {
      if (_gamepadEvent === GamepadEvents.BUTTON_B) {
        this.gamepadUiParser.pushButtonB();
      }
      const nextHandler = this._nextHandler.get();
      if (nextHandler !== void 0) {
        return nextHandler.handleGamepadEvent(_gamepadEvent);
      }
      switch (_gamepadEvent) {
        case GamepadEvents.JOYDIR_UP:
          this.gamepadUiParser.goUp();
          break;
        case GamepadEvents.JOYDIR_RIGHT:
          this.gamepadUiParser.goRight();
          break;
        case GamepadEvents.JOYDIR_DOWN:
          this.gamepadUiParser.goDown();
          break;
        case GamepadEvents.JOYDIR_LEFT:
          this.gamepadUiParser.goLeft();
          break;
        case GamepadEvents.BUTTON_A:
          this.gamepadUiParser.pushButtonA();
          break;
      }
    }
  };
  var ViewBootMode = /* @__PURE__ */ ((ViewBootMode2) => {
    ViewBootMode2[ViewBootMode2["COLD"] = 0] = "COLD";
    ViewBootMode2[ViewBootMode2["HOT"] = 1] = "HOT";
    return ViewBootMode2;
  })(ViewBootMode || {});
  var ViewSuspendMode = /* @__PURE__ */ ((ViewSuspendMode2) => {
    ViewSuspendMode2[ViewSuspendMode2["SLEEP"] = 0] = "SLEEP";
    ViewSuspendMode2[ViewSuspendMode2["TERMINATE"] = 1] = "TERMINATE";
    return ViewSuspendMode2;
  })(ViewSuspendMode || {});
  var defaultViewOptions = {
    BootMode: ViewBootMode.COLD,
    SuspendMode: ViewSuspendMode.SLEEP
  };
  var AppViewService = class {
    constructor(bus) {
      this.registeredUiViewEntries = /* @__PURE__ */ new Map();
      this.appViewStack = [];
      this.registeredUiViewPromises = [];
      this.hasInitialized = false;
      this._currentUiView = import_msfs_sdk.Subject.create(null);
      this.currentUiView = this._currentUiView;
      this.eventListener = {
        pause: [],
        resume: []
      };
      this.bus = bus;
      this.goHomeSub = this.bus.on(
        "_efb_appviewservice_go_home",
        () => {
          const steps = this.appViewStack.length - 1;
          if (steps >= 1) {
            this.goBack(steps);
          }
        },
        true
      );
    }
    onOpen() {
      var _a, _b;
      this.goHomeSub.resume();
      (_b = (_a = this.activeUiViewEntry) == null ? void 0 : _a.ref) == null ? void 0 : _b.onOpen();
    }
    onClose() {
      var _a, _b;
      this.goHomeSub.pause();
      (_b = (_a = this.activeUiViewEntry) == null ? void 0 : _a.ref) == null ? void 0 : _b.onClose();
    }
    onResume() {
      var _a, _b;
      this.goHomeSub.resume();
      (_b = (_a = this.activeUiViewEntry) == null ? void 0 : _a.ref) == null ? void 0 : _b.onResume();
    }
    onPause() {
      var _a, _b;
      this.goHomeSub.pause();
      (_b = (_a = this.activeUiViewEntry) == null ? void 0 : _a.ref) == null ? void 0 : _b.onPause();
    }
    /**
     * Registers and renders a view (page or popup) to be opened by the service.
     * @param key The UiView string key.
     * @param type The view type
     * @param vNodeFactory A function that returns a {@link UiView} VNode for the key
     * @param options The {@link UiView} {@link ViewOptions}
     * @returns UiViewEntry
     */
    registerView(key, type, vNodeFactory, options) {
      if (this.registeredUiViewEntries.has(key)) {
        throw new Error(`View "${key}" is already used`);
      } else if (typeof vNodeFactory !== "function") {
        throw new Error("vNodeFactory has to be a function returning a VNode");
      }
      const viewOptions = Object.assign({}, defaultViewOptions, options);
      const appViewEntry = {
        key,
        render: vNodeFactory,
        vNode: vNodeFactory,
        ref: null,
        containerRef: import_msfs_sdk.FSComponent.createRef(),
        isVisible: import_msfs_sdk.Subject.create(false),
        layer: import_msfs_sdk.Subject.create(-1),
        type: import_msfs_sdk.Subject.create(type),
        isInit: false,
        viewOptions
      };
      if (viewOptions.BootMode === ViewBootMode.HOT) {
        this.initViewEntry(appViewEntry);
      }
      this.registeredUiViewEntries.set(key, appViewEntry);
      return appViewEntry;
    }
    registerPage(key, vNodeFactory, options) {
      return this.registerView(key, "page", vNodeFactory, options);
    }
    registerPopup(key, vNodeFactory, options) {
      return this.registerView(key, "popup", vNodeFactory, options);
    }
    killView(viewEntry) {
      return __async(this, null, function* () {
        var _a;
        if (viewEntry.isInit === false) {
          return;
        }
        if (this.appViewStack.find((view) => view.key === viewEntry.key)) {
          throw new Error("You must close your view before killing it");
        }
        viewEntry.isInit = false;
        (_a = viewEntry.ref) == null ? void 0 : _a.destroy();
        viewEntry.containerRef.instance.destroy();
        viewEntry.ref = null;
        viewEntry.containerRef = import_msfs_sdk.FSComponent.createRef();
        viewEntry.vNode = viewEntry.render.bind(viewEntry);
        return new Promise((resolve) => {
          if (viewEntry.viewOptions.BootMode === ViewBootMode.HOT) {
            this.initViewEntry(viewEntry);
          }
          resolve();
        });
      });
    }
    /**
     * @param entry a {@link UiViewEntry}
     * @param shouldOpen opens the view on initialization, defaults to false
     */
    initViewEntry(entry, shouldOpen = false) {
      var _a;
      if (entry.isInit) {
        return;
      }
      entry.isInit = true;
      entry.vNode = value(entry.vNode);
      entry.ref = entry.vNode.instance;
      (_a = this.appViewRef) == null ? void 0 : _a.renderView(
        /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
          AppViewWrapper,
          {
            viewName: entry.key,
            isVisible: entry.isVisible,
            type: entry.type,
            layer: entry.layer,
            ref: entry.containerRef
          },
          entry.vNode
        )
      );
      shouldOpen && entry.ref.onOpen();
    }
    /**
     * Destroys every view in registered view entries and resets the view stack.
     */
    unload() {
      var _a;
      this.registeredUiViewPromises = [];
      for (const viewEntry of this.registeredUiViewEntries.values()) {
        (_a = viewEntry.ref) == null ? void 0 : _a.destroy();
      }
      this.registeredUiViewEntries.clear();
      this.appViewStack.splice(0, this.appViewStack.length);
      this.hasInitialized = false;
    }
    /**
     *
     * @param homePageUiViewKey the string key of the {@link UiView}
     * @returns a Promise resolving when all pages are initialized
     */
    initialize(homePageUiViewKey) {
      return __async(this, null, function* () {
        if (this.hasInitialized) {
          return Promise.resolve();
        }
        return Promise.all(this.registeredUiViewPromises).then(() => {
          this.initializeAppViewStack(homePageUiViewKey);
          this.hasInitialized = true;
        });
      });
    }
    /**
     * @returns the current active view entry.
     */
    get activeUiViewEntry() {
      const activeViewEntry = import_msfs_sdk.ArrayUtils.peekLast(this.appViewStack);
      return activeViewEntry;
    }
    on(event, viewKey, callback) {
      if (!this.registeredUiViewEntries.has(viewKey)) {
        console.error("Cannot listen for a non registered view.");
        return this;
      }
      this.eventListener[event].push({ key: viewKey, callback });
      return this;
    }
    /**
     * Handles logic associated with changing the open page.
     * @param page Page to close
     */
    handleCloseView(page) {
      var _a;
      if (!page) return;
      (_a = page.ref) == null ? void 0 : _a.onPause();
      this.eventListener.pause.forEach((e) => e.key === page.key && e.callback(page));
      page.isVisible.set(false);
      this._currentUiView.set(null);
      if (page.viewOptions.SuspendMode === ViewSuspendMode.TERMINATE) {
        setTimeout(() => this.killView(page));
      }
    }
    /**
     * Handles logic associated with changing the open page.
     * @param page Page to open
     */
    handleOpenView(page) {
      var _a;
      if (!page) return;
      (_a = page.ref) == null ? void 0 : _a.onResume();
      this.eventListener.resume.forEach((e) => e.key === page.key && e.callback(page));
      page.isVisible.set(true);
      this._currentUiView.set(page);
    }
    /**
     * Populate the view stack with its respective home page.
     * @param mainPageUiViewKey the key of the home page
     */
    initializeAppViewStack(mainPageUiViewKey) {
      this.open(mainPageUiViewKey);
    }
    /**
     * @param key the {@link UiView} string key
     * @returns the {@link UiViewEntry} corresponding to the key
     * @throws if the {@link UiViewEntry} doesn't exists
     */
    getUiViewEntry(key) {
      const appViewEntry = this.registeredUiViewEntries.get(key);
      if (!appViewEntry) {
        throw new Error(`${key} wasn't registered as a view`);
      }
      return appViewEntry;
    }
    /**
     * Called by AppContainer to pass in the refs to the view.
     * Should only be called once.
     * @param appViewRef The app view ref.
     */
    onAppContainerRendered(appViewRef) {
      this.appViewRef = appViewRef;
    }
    open(key) {
      const viewEntry = this.advanceViewStack(key);
      return viewEntry;
    }
    goBack(steps) {
      steps != null ? steps : steps = 1;
      if (steps <= 0) {
        throw new RangeError(`Steps must be superior to 0.`);
      } else if (steps >= this.appViewStack.length) {
        throw new RangeError(`Steps can't be superior to ${this.appViewStack.length} when called.`);
      }
      const activeViewEntry = this.activeUiViewEntry;
      if (this.appViewStack.length > steps && activeViewEntry) {
        this.eventListener.pause.forEach((e) => e.key === activeViewEntry.key && e.callback(activeViewEntry));
        const viewsToOpen = [];
        const viewsToClose = [];
        while (steps--) {
          const view = this.appViewStack.pop();
          if (view) {
            viewsToClose.push(view);
          }
        }
        let i = this.appViewStack.length;
        do {
          viewsToOpen.push(this.appViewStack[--i]);
        } while (i > 0 && this.appViewStack[i].type.get() !== "page");
        for (const page of viewsToClose) {
          this.handleCloseView(page);
        }
        for (const page of viewsToOpen.reverse()) {
          this.handleOpenView(page);
        }
      }
      return this.activeUiViewEntry;
    }
    /**
     * Handles view stack logic
     * @param key the {@link UiView} string key
     * @returns the current {@link UiViewEntry}
     */
    advanceViewStack(key) {
      const viewEntry = this.getUiViewEntry(key);
      if (this.appViewStack.includes(viewEntry)) {
        if (this.activeUiViewEntry !== viewEntry) {
          throw new Error("Page or popup is already in the viewstack and can't be opened twice");
        }
        return viewEntry;
      }
      switch (viewEntry.type.get()) {
        case "page":
          for (const page of [...this.appViewStack].reverse()) {
            this.handleCloseView(page);
          }
          break;
      }
      this.appViewStack.push(viewEntry);
      this.openView(viewEntry);
      this.handleOpenView(viewEntry);
      return viewEntry;
    }
    /**
     * Handle logic associated with opening a view
     * @param view the view to open.
     */
    openView(view) {
      if (!view.isInit) {
        this.initViewEntry(view, true);
      }
      const index2 = this.appViewStack.indexOf(view);
      if (index2 < 0) {
        throw new Error(`AppViewService: view not found in view stack: ${view.key}`);
      }
      view.layer.set(index2);
    }
    /**
     * Updates all the pages/popups that are initialized and visible
     * @param time timestamp
     */
    update(time) {
      this.registeredUiViewEntries.forEach((UiView2) => {
        var _a;
        if (UiView2.isInit && UiView2.isVisible.get()) {
          (_a = UiView2.ref) == null ? void 0 : _a.onUpdate(time);
        }
      });
    }
    /**
     * Routes the event to the current {@link UiView}
     * @param gamepadEvent the {@link GamepadEvents}
     */
    routeGamepadInteractionEvent(gamepadEvent) {
      const _currentUiView = this.activeUiViewEntry;
      if ((_currentUiView == null ? void 0 : _currentUiView.ref) instanceof GamepadUiView) {
        _currentUiView.ref.handleGamepadEvent(gamepadEvent);
      }
    }
  };
  var AppViewWrapper = class extends import_msfs_sdk.DisplayComponent {
    constructor() {
      super(...arguments);
      this.rootRef = import_msfs_sdk.FSComponent.createRef();
    }
    render() {
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
        "div",
        {
          ref: this.rootRef,
          class: {
            "ui-view": true,
            [this.props.viewName]: true,
            hidden: this.props.isVisible.map(import_msfs_sdk.SubscribableMapFunctions.not()),
            page: this.props.type.map(where("page")),
            popup: this.props.type.map(where("popup"))
          },
          style: {
            "z-index": this.props.layer.map(toString())
          }
        },
        this.props.children
      );
    }
    destroy() {
      var _a;
      const root = this.rootRef.getOrDefault();
      if (root !== null) {
        (_a = root.parentNode) == null ? void 0 : _a.removeChild(root);
      }
      super.destroy();
    }
  };
  var __defProp22 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = __getOwnPropDesc2(target, key);
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = decorator(target, key, result) || result;
    if (result) __defProp22(target, key, result);
    return result;
  };
  var AppView = class extends import_msfs_sdk.DisplayComponent {
    constructor(props) {
      var _a;
      super(props);
      this.rootRef = import_msfs_sdk.FSComponent.createRef();
      this.pageKeyActions = /* @__PURE__ */ new Map();
      this._appViewService = props.appViewService || (props.bus ? new AppViewService(props.bus) : void 0);
      this._bus = (_a = this._appViewService) == null ? void 0 : _a.bus;
      this._unitsSettingManager = props.unitsSettingManager;
      this._efbSettingsManager = props.efbSettingsManager;
      this._notificationManager = props.notificationManager;
      this._onboardingManager = props.onboardingManager;
    }
    get appViewService() {
      const _appViewService = this._appViewService;
      if (!_appViewService) {
        throw new Error(
          `Cannot resolve 'appViewService' because none of 'appViewService' and 'bus' props were given.`
        );
      }
      return _appViewService;
    }
    get bus() {
      const _bus = this._bus;
      if (!_bus) {
        throw new Error(`Cannot resolve 'bus' because none of 'appViewService' and 'bus' props were given.`);
      }
      return _bus;
    }
    get unitsSettingManager() {
      const _unitsSettingManager = this._unitsSettingManager;
      if (_unitsSettingManager === void 0) {
        throw new Error(`Cannot resolve 'unitsSettingManager'`);
      }
      return _unitsSettingManager;
    }
    get efbSettingsManager() {
      const _efbSettingsManager = this._efbSettingsManager;
      if (_efbSettingsManager === void 0) {
        throw new Error(`Cannot resolve 'efbSettingsManager'`);
      }
      return _efbSettingsManager;
    }
    /**
     * EFB notification manager
     * @returns a unique efbNotificationManager instance
     */
    get notificationManager() {
      const notificationManager = this._notificationManager;
      if (!notificationManager) {
        throw new Error("Notification manager is not defined");
      }
      return notificationManager;
    }
    get onboardingManager() {
      const _onboardingManager = this._onboardingManager;
      if (!_onboardingManager) {
        throw new Error(`Cannot resolve 'onboardingManager'`);
      }
      return _onboardingManager;
    }
    /**
     * Called once when the view is opened for the first time.
     */
    onOpen() {
      var _a;
      (_a = this._appViewService) == null ? void 0 : _a.onOpen();
    }
    /**
     * Called once when the view is destroyed.
     */
    onClose() {
      var _a;
      (_a = this._appViewService) == null ? void 0 : _a.onClose();
    }
    /**
     * Called each time the view is resumed.
     */
    onResume() {
      var _a;
      (_a = this._appViewService) == null ? void 0 : _a.onResume();
    }
    /**
     * Called each time the view is closed.
     */
    onPause() {
      var _a;
      (_a = this._appViewService) == null ? void 0 : _a.onPause();
    }
    /**
     * On Update loop - It update the `AppViewService` if it is used.
     * @param time in milliseconds
     */
    onUpdate(time) {
      var _a;
      (_a = this._appViewService) == null ? void 0 : _a.update(time);
    }
    /**
     * Callback to register all views the app might use.
     */
    registerViews() {
    }
    /**
     * @internal
     * TODO : Need to be documented after Gamepad integration
     */
    routeGamepadInteractionEvent(gamepadEvent) {
      var _a;
      (_a = this._appViewService) == null ? void 0 : _a.routeGamepadInteractionEvent(gamepadEvent);
    }
    /**
     * @internal
     * @param key custom page key defined in `pageKeyActions`
     * @param args array of arguments given to the defined callback
     */
    handlePageKeyAction(key, args) {
      if (key === null) {
        return;
      }
      const action = this.pageKeyActions.get(key);
      if (action === void 0) {
        console.error(`Key "${key}" doesn't exists.`);
        return;
      }
      toPromise(action(args)).catch((reason) => {
        console.error(`handlePageKeyAction Error for key "${key}"`, reason);
      });
    }
    /**
     * If using EFB's AppViewService, this method returns an AppContainer binded to AppViewService.
     * Otherwise it can be customized with plain JSX/TSX or custom view service, etc...
     *
     * @example
     * Surrounding AppContainer with a custom class:
     * ```ts
     * public render(): TVNode<HTMLDivElement> {
     * 	return <div class="my-custom-class">{super.render()}</div>;
     * }
     * ```
     * @example
     * Here's an plain JSX/TSX example:
     * ```ts
     * public render(): TVNode<HTMLSpanElement> {
     * 	return <span>Hello World!</span>;
     * }
     * ```
     */
    render() {
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(AppContainer, { appViewService: this.appViewService });
    }
    /** @inheritdoc */
    onAfterRender(node) {
      var _a;
      super.onAfterRender(node);
      this.registerViews();
      if (this.defaultView) {
        (_a = this._appViewService) == null ? void 0 : _a.initialize(this.defaultView);
      }
    }
    /** @internal */
    destroy() {
      var _a;
      (_a = this._appViewService) == null ? void 0 : _a.unload();
      super.destroy();
    }
  };
  __decorateClass([
    Memoize()
  ], AppView.prototype, "appViewService");
  __decorateClass([
    Memoize()
  ], AppView.prototype, "bus");
  __decorateClass([
    Memoize()
  ], AppView.prototype, "unitsSettingManager");
  __decorateClass([
    Memoize()
  ], AppView.prototype, "efbSettingsManager");
  __decorateClass([
    Memoize()
  ], AppView.prototype, "onboardingManager");
  var Button = class extends GamepadUiComponent {
    constructor() {
      var _a, _b, _c, _d;
      super(...arguments);
      this.isButtonDisabled = import_msfs_sdk.SubscribableUtils.toSubscribable((_a = this.props.disabled) != null ? _a : false, true);
      this.isButtonHoverable = import_msfs_sdk.MappedSubject.create(
        ([isHoverable, isDisabled]) => {
          return isHoverable && !isDisabled;
        },
        import_msfs_sdk.SubscribableUtils.toSubscribable((_b = this.props.hoverable) != null ? _b : true, true),
        this.isButtonDisabled
      );
      this.isButtonSelected = import_msfs_sdk.MappedSubject.create(
        ([isSelected, state]) => isSelected || state,
        import_msfs_sdk.SubscribableUtils.toSubscribable((_c = this.props.selected) != null ? _c : false, true),
        import_msfs_sdk.SubscribableUtils.toSubscribable((_d = this.props.state) != null ? _d : false, true)
      );
    }
    /**
     * @deprecated Old way to render the button. Instead of extending the `Button` class, render your content as a children of `<Button>...</Button>`.
     */
    buttonRender() {
      return null;
    }
    render() {
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
        "button",
        {
          ref: this.gamepadUiComponentRef,
          class: mergeClassProp(
            "button",
            "abstract-button",
            // deprecated
            {
              hoverable: this.isButtonHoverable,
              selected: this.isButtonSelected
            },
            this.props.class
          ),
          style: this.props.style
        },
        /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("div", { class: "disabled-layer" }),
        this.props.children,
        this.buttonRender()
      );
    }
    onAfterRender(node) {
      super.onAfterRender(node);
      if (this.props.callback) {
        this.gamepadUiComponentRef.instance.onclick = (event) => {
          var _a;
          if (this.isButtonDisabled.get() === true) {
            return;
          }
          (_a = this.props.callback) == null ? void 0 : _a.call(this, event);
        };
      }
    }
    destroy() {
      this.isButtonHoverable.destroy();
      super.destroy();
    }
  };
  var IconElement = class extends import_msfs_sdk.DisplayComponent {
    constructor(props) {
      super(props);
      this.url = import_msfs_sdk.SubscribableUtils.toSubscribable(this.props.url, true);
      this.el = import_msfs_sdk.FSComponent.createRef();
      this.classes = {
        "icon-element": true
      };
      this.onIconLoaded = (found, svgAsString) => {
        this.el.instance.innerText = "";
        if (!found) {
          console.error(`Image ${this.url.get()} was not found`);
          return;
        }
        const template = document.createElement("template");
        template.innerHTML = svgAsString;
        const svgAsHtml = template.content.querySelector("svg");
        if (svgAsHtml) {
          this.el.instance.appendChild(svgAsHtml);
        }
      };
      const propsClass = props.class;
      if (propsClass) {
        Object.assign(this.classes, typeof propsClass === "string" ? { [propsClass]: true } : propsClass);
      }
    }
    render() {
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("div", { ref: this.el, class: this.classes });
    }
    onAfterRender(node) {
      super.onAfterRender(node);
      this.urlSub = this.url.sub((url) => {
        if (!url.endsWith(".svg")) {
          console.error(`IconElement doesn't support ".${url.split(".").pop()}" filetype.`);
          return;
        }
        getIconCacheMgr().loadURL(url, this.onIconLoaded);
      }, true);
    }
    destroy() {
      var _a;
      (_a = this.urlSub) == null ? void 0 : _a.destroy();
      super.destroy();
    }
  };
  var IconButton = class extends import_msfs_sdk.DisplayComponent {
    iconRendering() {
      if (this.props.iconPath) {
        return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(IconElement, { url: this.props.iconPath });
      }
      return null;
    }
    render() {
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
        Button,
        {
          class: mergeClassProp("icon-button", this.props.class),
          style: this.props.style,
          callback: this.props.callback,
          hoverable: this.props.hoverable,
          selected: this.props.selected,
          state: this.props.state,
          disabled: this.props.disabled,
          onboardingStepId: this.props.onboardingStepId
        },
        this.iconRendering()
      );
    }
  };
  var _BearingDisplay = class _BearingDisplay2 extends import_msfs_sdk.AbstractNumberUnitDisplay {
    constructor() {
      var _a;
      super(...arguments);
      this.unitFormatter = (_a = this.props.unitFormatter) != null ? _a : _BearingDisplay2.DEFAULT_UNIT_FORMATTER;
      this.unitTextBigDisplay = import_msfs_sdk.Subject.create("");
      this.unitTextSmallDisplay = import_msfs_sdk.Subject.create("");
      this.numberText = import_msfs_sdk.Subject.create("");
      this.unitTextBig = import_msfs_sdk.Subject.create("");
      this.unitTextSmall = import_msfs_sdk.Subject.create("");
    }
    /** @inheritdoc */
    onValueChanged(value2) {
      let displayUnit = this.displayUnit.get();
      if (!displayUnit || !value2.unit.canConvert(displayUnit)) {
        displayUnit = value2.unit;
      }
      const numberValue = value2.asUnit(displayUnit);
      this.updateNumberText(numberValue);
      this.updateUnitText(numberValue, displayUnit);
      if (this.props.hideDegreeSymbolWhenNan === true) {
        this.updateUnitTextVisibility(numberValue);
      }
    }
    /** @inheritdoc */
    onDisplayUnitChanged(displayUnit) {
      const value2 = this.value.get();
      if (!displayUnit || !value2.unit.canConvert(displayUnit)) {
        displayUnit = value2.unit;
      }
      const numberValue = value2.asUnit(displayUnit);
      this.updateNumberText(numberValue);
      this.updateUnitText(numberValue, displayUnit);
      this.updateUnitTextVisibility(numberValue);
    }
    /**
     * Updates this component's displayed number text.
     * @param numberValue The numeric value to display.
     */
    updateNumberText(numberValue) {
      let numberText = this.props.formatter(numberValue);
      if (this.props.use360 !== false && parseFloat(numberText) === 0) {
        numberText = this.props.formatter(360);
      }
      this.numberText.set(numberText);
    }
    /**
     * Updates this component's displayed unit text.
     * @param numberValue The numeric value to display.
     * @param displayUnit The unit type in which to display the value.
     */
    updateUnitText(numberValue, displayUnit) {
      _BearingDisplay2.unitTextCache[0] = "";
      _BearingDisplay2.unitTextCache[1] = "";
      this.unitFormatter(_BearingDisplay2.unitTextCache, displayUnit, numberValue);
      this.unitTextBig.set(_BearingDisplay2.unitTextCache[0]);
      this.unitTextSmall.set(_BearingDisplay2.unitTextCache[1]);
    }
    /**
     * Updates whether this component's unit text spans are visible.
     * @param numberValue The numeric value displayed by this component.
     */
    updateUnitTextVisibility(numberValue) {
      if (this.props.hideDegreeSymbolWhenNan === true) {
        if (isNaN(numberValue)) {
          this.unitTextBigDisplay.set("none");
          this.unitTextSmallDisplay.set("none");
          return;
        }
      }
      this.unitTextBigDisplay.set(this.unitTextBig.get() === "" ? "none" : "");
      this.unitTextSmallDisplay.set(this.unitTextSmall.get() === "" ? "none" : "");
    }
    /** @inheritdoc */
    render() {
      var _a;
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("div", { class: (_a = this.props.class) != null ? _a : "", style: "white-space: nowrap;" }, /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("span", { class: "bearing-num" }, this.numberText), /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("span", { class: "bearing-unit", style: { display: this.unitTextBigDisplay } }, this.unitTextBig), /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("span", { class: "bearing-unit-small", style: { display: this.unitTextSmallDisplay } }, this.unitTextSmall));
    }
  };
  _BearingDisplay.DEFAULT_UNIT_FORMATTER = (out, unit) => {
    out[0] = "\xB0";
    out[1] = unit.isMagnetic() ? "" : "T";
  };
  _BearingDisplay.unitTextCache = ["", ""];
  var Input = class extends GamepadUiComponent {
    constructor() {
      var _a, _b;
      super(...arguments);
      this.uuid = import_msfs_sdk.UUID.GenerateUuid();
      this.input_id = "";
      this.inputRef = this.gamepadUiComponentRef;
      this.model = this.props.model || import_msfs_sdk.Subject.create(import_msfs_sdk.SubscribableUtils.toSubscribable(this.props.value || "", true).get());
      this.dispatchFocusOutEvent = this._dispatchFocusOutEvent.bind(this);
      this.setValueFromOS = this._setValueFromOS.bind(this);
      this._onKeyDown = this.onKeyDown.bind(this);
      this._onKeyUp = this.onKeyUp.bind(this);
      this._onKeyPress = this.onKeyPress.bind(this);
      this._onInput = this.onInput.bind(this);
      this.align = this.props.align || "left";
      this.debounce = new import_msfs_sdk.DebounceTimer();
      this.reloadLocalisation = this._reloadLocalisation.bind(this);
      this._isFocused = import_msfs_sdk.Subject.create(false);
      this.isFocused = this._isFocused;
      this.placeholderKey = import_msfs_sdk.SubscribableUtils.toSubscribable((_a = this.props.placeholder) != null ? _a : "", true);
      this.placeholderShown = import_msfs_sdk.Subject.create(true);
      this.placeholderTranslation = import_msfs_sdk.Subject.create(this.placeholderKey.get());
      this.hidePlaceholderOnFocus = (_b = this.props.hidePlaceholderOnFocus) != null ? _b : false;
      this.subs = [];
    }
    _reloadLocalisation() {
      this.placeholderTranslation.notify();
    }
    onKeyDown(event) {
      var _a, _b;
      (_b = (_a = this.props).onKeyDown) == null ? void 0 : _b.call(_a, event);
    }
    onKeyUp(event) {
      var _a, _b;
      (_b = (_a = this.props).onKeyUp) == null ? void 0 : _b.call(_a, event);
    }
    onKeyPress(event) {
      var _a, _b;
      const keyCode = event.keyCode || event.which;
      (_b = (_a = this.props).onKeyPress) == null ? void 0 : _b.call(_a, event);
      if (event.defaultPrevented) {
        return;
      }
      if (this.props.charFilter && !this.props.charFilter(String.fromCharCode(keyCode))) {
        event.preventDefault();
        return;
      }
    }
    onInput() {
      var _a;
      this.debounce.schedule(() => {
        const value2 = this.inputRef.instance.value;
        if (value2 === this.model.get()) {
          return;
        }
        this.model.set(value2);
      }, (_a = this.props.debounceDuration) != null ? _a : 0);
    }
    onInputUpdated(value2) {
      var _a, _b;
      this.inputRef.instance.value = value2;
      (_b = (_a = this.props).onInput) == null ? void 0 : _b.call(_a, this.inputRef.instance);
      if (!this.hidePlaceholderOnFocus && value2.length === 0) {
        this.placeholderShown.set(true);
      }
    }
    onFocusIn() {
      var _a, _b;
      (_b = (_a = this.props).onFocusIn) == null ? void 0 : _b.call(_a);
      this.input_id = InputsListener.addInputChangeCallback("MENU_CORE", "KEY_MENU_SR_BACK", (down) => {
        if (down) {
          this.inputRef.instance.blur();
        }
      });
      if (this.hidePlaceholderOnFocus && this.inputRef.instance.value.length === 0) {
        this.placeholderShown.set(false);
      }
    }
    onFocusOut() {
      var _a, _b;
      (_b = (_a = this.props).onFocusOut) == null ? void 0 : _b.call(_a);
      InputsListener.removeInputChangeCallback(this.input_id);
      if (this.hidePlaceholderOnFocus && this.inputRef.instance.value.length === 0) {
        this.placeholderShown.set(true);
      }
    }
    focus() {
      this.inputRef.instance.focus();
    }
    blur() {
      this.inputRef.instance.blur();
    }
    value() {
      return this.model.get();
    }
    clearInput() {
      this.model.set("");
    }
    _dispatchFocusOutEvent() {
      this.inputRef.instance.blur();
    }
    _setValueFromOS(text) {
      this.inputRef.instance.value = text;
      this.inputRef.instance.dispatchEvent(new InputEvent("change"));
      this.inputRef.instance.dispatchEvent(new InputEvent("input"));
      this.inputRef.instance.dispatchEvent(new InputEvent("focusout"));
      this.inputRef.instance.blur();
    }
    render() {
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
        "input",
        {
          id: this.uuid,
          ref: this.inputRef,
          type: this.props.type,
          class: {
            [`align-${this.align}`]: this.align !== "left"
          },
          placeholder: import_msfs_sdk.MappedSubject.create(
            ([placeholderShown, placeholderKey]) => {
              return placeholderShown ? Utils.Translate(placeholderKey) : "";
            },
            this.placeholderShown,
            this.placeholderKey
          ),
          disabled: this.props.disabled,
          value: import_msfs_sdk.SubscribableUtils.toSubscribable(this.props.model || this.props.value || "", true).get()
        }
      );
    }
    onAfterRender(node) {
      super.onAfterRender(node);
      this.subs.push(
        this.model.sub((value2) => {
          this.onInputUpdated(value2);
        }, true),
        this.placeholderKey.sub((key) => {
          this.placeholderTranslation.set(key);
        }, true)
      );
      this.inputRef.instance.addEventListener("focus", () => {
        if (this._isFocused.get()) {
          return;
        }
        this._isFocused.set(true);
        Coherent.trigger("FOCUS_INPUT_FIELD", this.uuid, "", "", "", this.props.type === "number");
        Coherent.on("mousePressOutsideView", this.dispatchFocusOutEvent);
        Coherent.on("SetInputTextFromOS", this.setValueFromOS);
        this.onFocusIn();
      });
      this.inputRef.instance.addEventListener("focusout", () => {
        if (!this._isFocused.get()) {
          return;
        }
        this._isFocused.set(false);
        Coherent.trigger("UNFOCUS_INPUT_FIELD", this.uuid);
        Coherent.off("mousePressOutsideView", this.dispatchFocusOutEvent);
        Coherent.off("SetInputTextFromOS", this.setValueFromOS);
        this.onFocusOut();
      });
      this.inputRef.instance.addEventListener("input", this._onInput);
      this.inputRef.instance.addEventListener("keydown", this._onKeyDown);
      this.inputRef.instance.addEventListener("keyup", this._onKeyUp);
      this.inputRef.instance.addEventListener("keypress", this._onKeyPress);
      Coherent.on("RELOAD_LOCALISATION", this.reloadLocalisation);
      if (this.props.focusOnInit) {
        this.focus();
      }
    }
    destroy() {
      this.subs.forEach((s) => s.destroy());
      if (this._isFocused.get()) {
        Coherent.trigger("UNFOCUS_INPUT_FIELD", this.uuid);
        Coherent.off("mousePressOutsideView", this.dispatchFocusOutEvent);
      }
      this.inputRef.instance.removeEventListener("keydown", this._onKeyDown);
      this.inputRef.instance.removeEventListener("keyup", this._onKeyUp);
      this.inputRef.instance.removeEventListener("keypress", this._onKeyPress);
      this.inputRef.instance.removeEventListener("input", this._onInput);
      Coherent.off("RELOAD_LOCALISATION", this.reloadLocalisation);
      super.destroy();
    }
  };
  var addIconPath = "coui://html_ui/efb_ui/efb_os/Assets/icons/NoMargin/Close.svg";
  var TextBox = class extends GamepadUiComponent {
    constructor() {
      super(...arguments);
      this.subscriptions = [];
      this.inputRef = import_msfs_sdk.FSComponent.createRef();
      this.model = this.props.model || import_msfs_sdk.Subject.create(import_msfs_sdk.SubscribableUtils.toSubscribable(this.props.value || "", true).get());
      this.hideDeleteTextButton = import_msfs_sdk.Subject.create(true);
      this.onDelete = this._onDelete.bind(this);
      this.onmousedown = (e) => {
        e.preventDefault();
        if (!this.inputRef.instance.isFocused.get()) {
          this.inputRef.instance.focus();
        }
      };
      this.prefix = import_msfs_sdk.SubscribableUtils.toSubscribable(
        this.props.prefix || "",
        true
      );
      this.suffix = import_msfs_sdk.SubscribableUtils.toSubscribable(
        this.props.suffix || "",
        true
      );
      this.showPrefix = import_msfs_sdk.SubscribableUtils.toSubscribable(this.props.showPrefix || true, true);
      this.showSuffix = import_msfs_sdk.SubscribableUtils.toSubscribable(this.props.showSuffix || true, true);
      this.prefixRef = import_msfs_sdk.FSComponent.createRef();
      this.suffixRef = import_msfs_sdk.FSComponent.createRef();
      this.showPrefixOrSuffixMapFunction = ([value2, show]) => {
        return !show || value2.toString().length === 0;
      };
    }
    _onDelete(event) {
      var _a, _b;
      event.preventDefault();
      this.hideDeleteTextButton.set(true);
      this.inputRef.instance.clearInput();
      (_b = (_a = this.props).onDelete) == null ? void 0 : _b.call(_a);
      if (this.props.focusOnClear) {
        this.inputRef.instance.focus();
      }
    }
    onInput(input) {
      var _a, _b;
      (_b = (_a = this.props).onInput) == null ? void 0 : _b.call(_a, input);
      if (this.props.showDeleteIcon) {
        this.hideDeleteTextButton.set(input.value.trim().length === 0);
      }
    }
    onFocusIn() {
      var _a, _b;
      (_b = (_a = this.props).onFocusIn) == null ? void 0 : _b.call(_a);
      this.gamepadUiComponentRef.instance.classList.add("textbox--focused");
    }
    onFocusOut() {
      var _a, _b;
      (_b = (_a = this.props).onFocusOut) == null ? void 0 : _b.call(_a);
      this.gamepadUiComponentRef.instance.classList.remove("textbox--focused");
    }
    render() {
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("div", { ref: this.gamepadUiComponentRef, class: "textbox" }, /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("div", { class: "disabled-layer" }), /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
        "div",
        {
          ref: this.prefixRef,
          class: {
            prefix: true,
            "prefix--hidden": import_msfs_sdk.MappedSubject.create(this.prefix, this.showPrefix).map(
              this.showPrefixOrSuffixMapFunction
            )
          }
        }
      ), /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
        Input,
        {
          ref: this.inputRef,
          type: "text",
          align: this.props.align,
          model: this.model,
          placeholder: this.props.placeholder,
          disabled: this.props.disabled,
          hidePlaceholderOnFocus: this.props.hidePlaceholderOnFocus,
          focusOnInit: this.props.focusOnInit,
          onFocusIn: this.onFocusIn.bind(this),
          onFocusOut: this.onFocusOut.bind(this),
          onInput: this.onInput.bind(this),
          debounceDuration: this.props.debounceDuration,
          onKeyDown: this.props.onKeyDown,
          onKeyUp: this.props.onKeyUp,
          onKeyPress: this.props.onKeyPress,
          charFilter: this.props.charFilter
        }
      ), /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
        "div",
        {
          ref: this.suffixRef,
          class: {
            suffix: true,
            "suffix--hidden": import_msfs_sdk.MappedSubject.create(this.suffix, this.showSuffix).map(
              this.showPrefixOrSuffixMapFunction
            )
          }
        }
      ), this.props.showDeleteIcon && /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
        IconButton,
        {
          class: mergeClassProp("delete-text-button", { hide: this.hideDeleteTextButton }),
          iconPath: addIconPath,
          callback: this.onDelete
        }
      ));
    }
    onAfterRender(node) {
      super.onAfterRender(node);
      const prefixSuffixCb = (reference) => {
        let previousNode = null;
        return (value2) => {
          if (previousNode) {
            import_msfs_sdk.FSComponent.shallowDestroy(previousNode);
            const instance = previousNode.instance;
            if (instance && instance instanceof import_msfs_sdk.DisplayComponent) {
              instance.destroy();
            }
            previousNode = null;
          }
          if (typeof value2 === "string") {
            reference.instance.innerText = value2;
          } else if (typeof value2 === "object" && isVNode(value2)) {
            previousNode = value2;
            reference.instance.innerHTML = "";
            import_msfs_sdk.FSComponent.render(value2, reference.instance);
          } else {
            reference.instance.innerText = value2;
          }
        };
      };
      this.subscriptions.push(
        this.prefix.sub(prefixSuffixCb(this.prefixRef), true),
        this.suffix.sub(prefixSuffixCb(this.suffixRef), true)
      );
      this.gamepadUiComponentRef.instance.addEventListener("mousedown", this.onmousedown);
    }
    destroy() {
      this.gamepadUiComponentRef.instance.removeEventListener("mousedown", this.onmousedown);
      this.subscriptions.forEach((s) => s.destroy());
      super.destroy();
    }
  };
  var _UnitBox = class _UnitBox2 extends GamepadUiComponent {
    constructor() {
      var _a, _b;
      super(...arguments);
      this.valueNumber = this.props.value;
      this.unit = import_msfs_sdk.SubscribableUtils.toSubscribable((_a = this.props.unit) != null ? _a : null, true);
      this.showUnitSuffix = import_msfs_sdk.SubscribableUtils.toSubscribable((_b = this.props.showSuffix) != null ? _b : true, true);
      this.valueText = import_msfs_sdk.Subject.create("0");
      this.subs = [];
      this.suffixSmall = import_msfs_sdk.Subject.create("");
      this.suffixBig = import_msfs_sdk.Subject.create("");
    }
    static createDefaultUnitTextMap() {
      const originalMap = UnitFormatter.getUnitTextMap();
      const map = {};
      for (const family in originalMap) {
        const nameMap = map[family] = {};
        const originalNameMap = originalMap[family];
        for (const name in originalNameMap) {
          const text = nameMap[name] = ["", ""];
          const originalText = originalNameMap[name];
          if (originalText[0].startsWith("\xB0")) {
            text[0] = "\xB0";
            text[1] = originalText.substring(1);
          } else {
            text[1] = originalText;
          }
        }
      }
      return map;
    }
    updateDisplay(value2, displayUnit) {
      if (!displayUnit || !value2.unit.canConvert(displayUnit)) {
        displayUnit = value2.unit;
      }
      const numberValue = value2.asUnit(displayUnit);
      if (numberValue >= 9999999) {
        this.valueText.set("9999999");
        return;
      }
      const numberText = import_msfs_sdk.NumberFormatter.create({
        nanString: "0"
      })(numberValue);
      if (numberText.includes(".")) {
        const dotPos = numberText.indexOf(".");
        this.valueText.set(numberText.substring(0, dotPos + 3));
      } else {
        this.valueText.set(this.valueText.get().includes(".") ? `${numberText}.` : numberText);
      }
      const unitTexts = _UnitBox2.DEFAULT_UNIT_FORMATTER(displayUnit);
      if (unitTexts === null) {
        this.suffixSmall.set("");
        this.suffixBig.set("");
        return;
      }
      this.suffixSmall.set(unitTexts[0]);
      this.suffixBig.set(unitTexts[1]);
    }
    render() {
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
        "div",
        {
          ref: this.gamepadUiComponentRef,
          class: { unitbox: true, "unitbox--disabled": this.props.disabled || false }
        },
        /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(
          TextBox,
          {
            align: "right",
            showDeleteIcon: this.props.showDeleteIcon || false,
            customDeleteIcon: this.props.customDeleteIcon,
            focusOnClear: this.props.focusOnClear,
            onDelete: this.props.onDelete,
            model: this.valueText,
            placeholder: this.props.placeholder,
            hidePlaceholderOnFocus: this.props.hidePlaceholderOnFocus,
            disabled: this.props.disabled,
            focusOnInit: this.props.focusOnInit,
            onFocusIn: this.props.onFocusIn,
            onFocusOut: this.props.onFocusOut,
            onInput: this.props.onInput,
            onKeyPress: this.props.onKeyPress,
            charFilter: (char) => char >= "0" && char <= "9" || [",", "."].includes(char),
            suffix: /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent(import_msfs_sdk.FSComponent.Fragment, null, /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("span", null, this.suffixSmall), /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("span", null, this.suffixBig)),
            showSuffix: this.showUnitSuffix
          }
        )
      );
    }
    onAfterRender(node) {
      super.onAfterRender(node);
      this.subs.push(
        this.valueText.sub((value2) => {
          value2 = value2.replace(",", ".").replace(/\.+$/, "");
          let displayUnit = this.unit.get();
          if (!displayUnit || !this.valueNumber.get().unit.canConvert(displayUnit)) {
            displayUnit = this.valueNumber.get().unit;
          }
          const unitValue = displayUnit.convertTo(Number(value2), this.valueNumber.get().unit);
          this.valueNumber.set(unitValue);
          this.updateDisplay(this.valueNumber.get(), this.unit.get());
        }),
        this.valueNumber.sub((value2) => {
          this.updateDisplay(value2, this.unit.get());
        }, true),
        this.unit.sub((unit) => {
          this.updateDisplay(this.valueNumber.get(), unit);
        }, true)
      );
    }
    destroy() {
      this.subs.forEach((s) => s.destroy());
      super.destroy();
    }
  };
  _UnitBox.DEFAULT_UNIT_TEXT_MAP = _UnitBox.createDefaultUnitTextMap();
  _UnitBox.DEFAULT_UNIT_FORMATTER = (unit) => {
    var _a;
    const text = (_a = _UnitBox.DEFAULT_UNIT_TEXT_MAP[unit.family]) == null ? void 0 : _a[unit.name];
    if (text) {
      return text;
    }
    return null;
  };
  var MapShim = (function() {
    if (typeof Map !== "undefined") {
      return Map;
    }
    function getIndex(arr, key) {
      var result = -1;
      arr.some(function(entry, index2) {
        if (entry[0] === key) {
          result = index2;
          return true;
        }
        return false;
      });
      return result;
    }
    return (
      /** @class */
      (function() {
        function class_1() {
          this.__entries__ = [];
        }
        Object.defineProperty(class_1.prototype, "size", {
          /**
           * @returns {boolean}
           */
          get: function() {
            return this.__entries__.length;
          },
          enumerable: true,
          configurable: true
        });
        class_1.prototype.get = function(key) {
          var index2 = getIndex(this.__entries__, key);
          var entry = this.__entries__[index2];
          return entry && entry[1];
        };
        class_1.prototype.set = function(key, value2) {
          var index2 = getIndex(this.__entries__, key);
          if (~index2) {
            this.__entries__[index2][1] = value2;
          } else {
            this.__entries__.push([key, value2]);
          }
        };
        class_1.prototype.delete = function(key) {
          var entries = this.__entries__;
          var index2 = getIndex(entries, key);
          if (~index2) {
            entries.splice(index2, 1);
          }
        };
        class_1.prototype.has = function(key) {
          return !!~getIndex(this.__entries__, key);
        };
        class_1.prototype.clear = function() {
          this.__entries__.splice(0);
        };
        class_1.prototype.forEach = function(callback, ctx) {
          if (ctx === void 0) {
            ctx = null;
          }
          for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
            var entry = _a[_i];
            callback.call(ctx, entry[1], entry[0]);
          }
        };
        return class_1;
      })()
    );
  })();
  var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
  var global$1 = (function() {
    if (typeof global !== "undefined" && global.Math === Math) {
      return global;
    }
    if (typeof self !== "undefined" && self.Math === Math) {
      return self;
    }
    if (typeof window !== "undefined" && window.Math === Math) {
      return window;
    }
    return Function("return this")();
  })();
  var requestAnimationFrame$1 = (function() {
    if (typeof requestAnimationFrame === "function") {
      return requestAnimationFrame.bind(global$1);
    }
    return function(callback) {
      return setTimeout(function() {
        return callback(Date.now());
      }, 1e3 / 60);
    };
  })();
  var trailingTimeout = 2;
  function throttle(callback, delay) {
    var leadingCall = false, trailingCall = false, lastCallTime = 0;
    function resolvePending() {
      if (leadingCall) {
        leadingCall = false;
        callback();
      }
      if (trailingCall) {
        proxy();
      }
    }
    function timeoutCallback() {
      requestAnimationFrame$1(resolvePending);
    }
    function proxy() {
      var timeStamp = Date.now();
      if (leadingCall) {
        if (timeStamp - lastCallTime < trailingTimeout) {
          return;
        }
        trailingCall = true;
      } else {
        leadingCall = true;
        trailingCall = false;
        setTimeout(timeoutCallback, delay);
      }
      lastCallTime = timeStamp;
    }
    return proxy;
  }
  var REFRESH_DELAY = 20;
  var transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
  var mutationObserverSupported = typeof MutationObserver !== "undefined";
  var ResizeObserverController = (
    /** @class */
    (function() {
      function ResizeObserverController2() {
        this.connected_ = false;
        this.mutationEventsAdded_ = false;
        this.mutationsObserver_ = null;
        this.observers_ = [];
        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
      }
      ResizeObserverController2.prototype.addObserver = function(observer) {
        if (!~this.observers_.indexOf(observer)) {
          this.observers_.push(observer);
        }
        if (!this.connected_) {
          this.connect_();
        }
      };
      ResizeObserverController2.prototype.removeObserver = function(observer) {
        var observers2 = this.observers_;
        var index2 = observers2.indexOf(observer);
        if (~index2) {
          observers2.splice(index2, 1);
        }
        if (!observers2.length && this.connected_) {
          this.disconnect_();
        }
      };
      ResizeObserverController2.prototype.refresh = function() {
        var changesDetected = this.updateObservers_();
        if (changesDetected) {
          this.refresh();
        }
      };
      ResizeObserverController2.prototype.updateObservers_ = function() {
        var activeObservers = this.observers_.filter(function(observer) {
          return observer.gatherActive(), observer.hasActive();
        });
        activeObservers.forEach(function(observer) {
          return observer.broadcastActive();
        });
        return activeObservers.length > 0;
      };
      ResizeObserverController2.prototype.connect_ = function() {
        if (!isBrowser || this.connected_) {
          return;
        }
        document.addEventListener("transitionend", this.onTransitionEnd_);
        window.addEventListener("resize", this.refresh);
        if (mutationObserverSupported) {
          this.mutationsObserver_ = new MutationObserver(this.refresh);
          this.mutationsObserver_.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        } else {
          document.addEventListener("DOMSubtreeModified", this.refresh);
          this.mutationEventsAdded_ = true;
        }
        this.connected_ = true;
      };
      ResizeObserverController2.prototype.disconnect_ = function() {
        if (!isBrowser || !this.connected_) {
          return;
        }
        document.removeEventListener("transitionend", this.onTransitionEnd_);
        window.removeEventListener("resize", this.refresh);
        if (this.mutationsObserver_) {
          this.mutationsObserver_.disconnect();
        }
        if (this.mutationEventsAdded_) {
          document.removeEventListener("DOMSubtreeModified", this.refresh);
        }
        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
      };
      ResizeObserverController2.prototype.onTransitionEnd_ = function(_a) {
        var _b = _a.propertyName, propertyName = _b === void 0 ? "" : _b;
        var isReflowProperty = transitionKeys.some(function(key) {
          return !!~propertyName.indexOf(key);
        });
        if (isReflowProperty) {
          this.refresh();
        }
      };
      ResizeObserverController2.getInstance = function() {
        if (!this.instance_) {
          this.instance_ = new ResizeObserverController2();
        }
        return this.instance_;
      };
      ResizeObserverController2.instance_ = null;
      return ResizeObserverController2;
    })()
  );
  var defineConfigurable = function(target, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
      var key = _a[_i];
      Object.defineProperty(target, key, {
        value: props[key],
        enumerable: false,
        writable: false,
        configurable: true
      });
    }
    return target;
  };
  var getWindowOf = function(target) {
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
    return ownerGlobal || global$1;
  };
  var emptyRect = createRectInit(0, 0, 0, 0);
  function toFloat(value2) {
    return parseFloat(value2) || 0;
  }
  function getBordersSize(styles) {
    var positions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      positions[_i - 1] = arguments[_i];
    }
    return positions.reduce(function(size, position) {
      var value2 = styles["border-" + position + "-width"];
      return size + toFloat(value2);
    }, 0);
  }
  function getPaddings(styles) {
    var positions = ["top", "right", "bottom", "left"];
    var paddings = {};
    for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
      var position = positions_1[_i];
      var value2 = styles["padding-" + position];
      paddings[position] = toFloat(value2);
    }
    return paddings;
  }
  function getSVGContentRect(target) {
    var bbox = target.getBBox();
    return createRectInit(0, 0, bbox.width, bbox.height);
  }
  function getHTMLElementContentRect(target) {
    var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
    if (!clientWidth && !clientHeight) {
      return emptyRect;
    }
    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;
    var width = toFloat(styles.width), height = toFloat(styles.height);
    if (styles.boxSizing === "border-box") {
      if (Math.round(width + horizPad) !== clientWidth) {
        width -= getBordersSize(styles, "left", "right") + horizPad;
      }
      if (Math.round(height + vertPad) !== clientHeight) {
        height -= getBordersSize(styles, "top", "bottom") + vertPad;
      }
    }
    if (!isDocumentElement(target)) {
      var vertScrollbar = Math.round(width + horizPad) - clientWidth;
      var horizScrollbar = Math.round(height + vertPad) - clientHeight;
      if (Math.abs(vertScrollbar) !== 1) {
        width -= vertScrollbar;
      }
      if (Math.abs(horizScrollbar) !== 1) {
        height -= horizScrollbar;
      }
    }
    return createRectInit(paddings.left, paddings.top, width, height);
  }
  var isSVGGraphicsElement = (function() {
    if (typeof SVGGraphicsElement !== "undefined") {
      return function(target) {
        return target instanceof getWindowOf(target).SVGGraphicsElement;
      };
    }
    return function(target) {
      return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
    };
  })();
  function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
  }
  function getContentRect(target) {
    if (!isBrowser) {
      return emptyRect;
    }
    if (isSVGGraphicsElement(target)) {
      return getSVGContentRect(target);
    }
    return getHTMLElementContentRect(target);
  }
  function createReadOnlyRect(_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);
    defineConfigurable(rect, {
      x,
      y,
      width,
      height,
      top: y,
      right: x + width,
      bottom: height + y,
      left: x
    });
    return rect;
  }
  function createRectInit(x, y, width, height) {
    return { x, y, width, height };
  }
  var ResizeObservation = (
    /** @class */
    (function() {
      function ResizeObservation2(target) {
        this.broadcastWidth = 0;
        this.broadcastHeight = 0;
        this.contentRect_ = createRectInit(0, 0, 0, 0);
        this.target = target;
      }
      ResizeObservation2.prototype.isActive = function() {
        var rect = getContentRect(this.target);
        this.contentRect_ = rect;
        return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
      };
      ResizeObservation2.prototype.broadcastRect = function() {
        var rect = this.contentRect_;
        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
        return rect;
      };
      return ResizeObservation2;
    })()
  );
  var ResizeObserverEntry = (
    /** @class */
    /* @__PURE__ */ (function() {
      function ResizeObserverEntry2(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);
        defineConfigurable(this, { target, contentRect });
      }
      return ResizeObserverEntry2;
    })()
  );
  var ResizeObserverSPI = (
    /** @class */
    (function() {
      function ResizeObserverSPI2(callback, controller, callbackCtx) {
        this.activeObservations_ = [];
        this.observations_ = new MapShim();
        if (typeof callback !== "function") {
          throw new TypeError("The callback provided as parameter 1 is not a function.");
        }
        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
      }
      ResizeObserverSPI2.prototype.observe = function(target) {
        if (!arguments.length) {
          throw new TypeError("1 argument required, but only 0 present.");
        }
        if (typeof Element === "undefined" || !(Element instanceof Object)) {
          return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
          throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        if (observations.has(target)) {
          return;
        }
        observations.set(target, new ResizeObservation(target));
        this.controller_.addObserver(this);
        this.controller_.refresh();
      };
      ResizeObserverSPI2.prototype.unobserve = function(target) {
        if (!arguments.length) {
          throw new TypeError("1 argument required, but only 0 present.");
        }
        if (typeof Element === "undefined" || !(Element instanceof Object)) {
          return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
          throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        if (!observations.has(target)) {
          return;
        }
        observations.delete(target);
        if (!observations.size) {
          this.controller_.removeObserver(this);
        }
      };
      ResizeObserverSPI2.prototype.disconnect = function() {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
      };
      ResizeObserverSPI2.prototype.gatherActive = function() {
        var _this = this;
        this.clearActive();
        this.observations_.forEach(function(observation) {
          if (observation.isActive()) {
            _this.activeObservations_.push(observation);
          }
        });
      };
      ResizeObserverSPI2.prototype.broadcastActive = function() {
        if (!this.hasActive()) {
          return;
        }
        var ctx = this.callbackCtx_;
        var entries = this.activeObservations_.map(function(observation) {
          return new ResizeObserverEntry(observation.target, observation.broadcastRect());
        });
        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
      };
      ResizeObserverSPI2.prototype.clearActive = function() {
        this.activeObservations_.splice(0);
      };
      ResizeObserverSPI2.prototype.hasActive = function() {
        return this.activeObservations_.length > 0;
      };
      return ResizeObserverSPI2;
    })()
  );
  var observers = typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : new MapShim();
  var ResizeObserver = (
    /** @class */
    /* @__PURE__ */ (function() {
      function ResizeObserver2(callback) {
        if (!(this instanceof ResizeObserver2)) {
          throw new TypeError("Cannot call a class as a function.");
        }
        if (!arguments.length) {
          throw new TypeError("1 argument required, but only 0 present.");
        }
        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);
        observers.set(this, observer);
      }
      return ResizeObserver2;
    })()
  );
  [
    "observe",
    "unobserve",
    "disconnect"
  ].forEach(function(method) {
    ResizeObserver.prototype[method] = function() {
      var _a;
      return (_a = observers.get(this))[method].apply(_a, arguments);
    };
  });
  var index = (function() {
    if (typeof global$1.ResizeObserver !== "undefined") {
      return global$1.ResizeObserver;
    }
    return ResizeObserver;
  })();
  var _NumberUnitDisplay = class _NumberUnitDisplay2 extends import_msfs_sdk.AbstractNumberUnitDisplay {
    constructor() {
      var _a, _b;
      super(...arguments);
      this.formatter = (_a = this.props.formatter) != null ? _a : import_msfs_sdk.NumberFormatter.create({
        // TODO Properly format the time
        precision: 0.01,
        maxDigits: 5,
        forceDecimalZeroes: false,
        nanString: "0"
      });
      this.unitFormatter = (_b = this.props.unitFormatter) != null ? _b : _NumberUnitDisplay2.DEFAULT_UNIT_FORMATTER;
      this.unitTextBigDisplay = import_msfs_sdk.Subject.create("");
      this.unitTextSmallDisplay = import_msfs_sdk.Subject.create("");
      this.numberText = import_msfs_sdk.Subject.create("");
      this.unitTextBig = import_msfs_sdk.Subject.create("");
      this.unitTextSmall = import_msfs_sdk.Subject.create("");
    }
    /** @inheritdoc */
    onValueChanged(value2) {
      this.updateDisplay(value2, this.displayUnit.get());
    }
    /** @inheritdoc */
    onDisplayUnitChanged(displayUnit) {
      this.updateDisplay(this.value.get(), displayUnit);
    }
    /**
     * Updates this component's displayed number and unit text.
     * @param value The value to display.
     * @param displayUnit The unit type in which to display the value, or `null` if the value should be displayed in its
     * native unit type.
     */
    updateDisplay(value2, displayUnit) {
      if (!displayUnit || !value2.unit.canConvert(displayUnit)) {
        displayUnit = value2.unit;
      }
      const numberValue = value2.asUnit(displayUnit);
      const numberText = this.formatter(numberValue);
      this.numberText.set(numberText);
      _NumberUnitDisplay2.unitTextCache[0] = "";
      _NumberUnitDisplay2.unitTextCache[1] = "";
      this.unitFormatter(_NumberUnitDisplay2.unitTextCache, displayUnit, numberValue);
      this.unitTextBig.set(_NumberUnitDisplay2.unitTextCache[0]);
      this.unitTextSmall.set(_NumberUnitDisplay2.unitTextCache[1]);
      this.updateUnitTextVisibility(
        numberValue,
        _NumberUnitDisplay2.unitTextCache[0],
        _NumberUnitDisplay2.unitTextCache[1]
      );
    }
    /**
     * Updates whether this component's unit text spans are visible.
     * @param numberValue The numeric value displayed by this component.
     * @param unitTextBig The text to display in the big text span.
     * @param unitTextSmall The text to display in the small text span.
     */
    updateUnitTextVisibility(numberValue, unitTextBig, unitTextSmall) {
      if (this.props.hideUnitWhenNaN === true && isNaN(numberValue)) {
        this.unitTextBigDisplay.set("none");
        this.unitTextSmallDisplay.set("none");
        return;
      }
      this.unitTextBigDisplay.set(unitTextBig === "" ? "none" : "");
      this.unitTextSmallDisplay.set(unitTextSmall === "" ? "none" : "");
    }
    /**
     * Creates the default mapping from unit to displayed text.
     * @returns The default mapping from unit to displayed text.
     */
    static createDefaultUnitTextMap() {
      const originalMap = UnitFormatter.getUnitTextMap();
      const map = {};
      for (const family in originalMap) {
        const nameMap = map[family] = {};
        const originalNameMap = originalMap[family];
        for (const name in originalNameMap) {
          const text = nameMap[name] = ["", ""];
          const originalText = originalNameMap[name];
          if (originalText[0] === "\xB0") {
            text[0] = "\xB0";
            text[1] = originalText.substring(1);
          } else {
            text[1] = originalText;
          }
        }
      }
      return map;
    }
    render() {
      var _a;
      return /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("div", { class: (_a = this.props.class) != null ? _a : "", style: "white-space: nowrap;" }, /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("span", { class: "numberunit-num" }, this.numberText), /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("span", { class: "numberunit-unit-big", style: { display: this.unitTextBigDisplay } }, this.unitTextBig), /* @__PURE__ */ import_msfs_sdk.FSComponent.buildComponent("span", { class: "numberunit-unit-small", style: { display: this.unitTextSmallDisplay } }, this.unitTextSmall));
    }
  };
  _NumberUnitDisplay.DEFAULT_UNIT_TEXT_MAP = _NumberUnitDisplay.createDefaultUnitTextMap();
  _NumberUnitDisplay.DEFAULT_UNIT_FORMATTER = (out, unit) => {
    var _a;
    const text = (_a = _NumberUnitDisplay.DEFAULT_UNIT_TEXT_MAP[unit.family]) == null ? void 0 : _a[unit.name];
    if (text) {
      out[0] = text[0];
      out[1] = text[1];
    }
  };
  _NumberUnitDisplay.unitTextCache = ["", ""];
  var _FacilitySearchUtils = class _FacilitySearchUtils2 {
    constructor(bus) {
      this.facilityLoader = null;
      this.position = new import_msfs_sdk.GeoPoint(0, 0);
      bus.getSubscriber().on("gps-position").handle((pos) => {
        this.position.set(pos.lat, pos.long);
      });
      this.facilityLoader = new import_msfs_sdk.FacilityLoader(import_msfs_sdk.FacilityRepository.getRepository(bus));
    }
    static getSearchUtils(bus) {
      var _a;
      return (_a = _FacilitySearchUtils2.INSTANCE) != null ? _a : _FacilitySearchUtils2.INSTANCE = new _FacilitySearchUtils2(bus);
    }
    orderByIdentsAndDistance(a, b) {
      const aIdent = a.icaoStruct.ident.trim();
      const bIdent = b.icaoStruct.ident.trim();
      if (aIdent === bIdent) {
        const aDist = this.position.distance(a.lat, a.lon);
        const bDist = this.position.distance(b.lat, b.lon);
        return aDist - bDist;
      } else {
        return aIdent.localeCompare(bIdent);
      }
    }
    /**
     * Loads facilities based on an ident to search for, a search type and whether to exclude terminal facilities
     * @param ident The ident to search for
     * @param facilitySearchType The search type. Defaults to {@link FacilitySearchType.All}
     * @param excludeTerminalFacilities Whether to exclude terminal facilities. Defaults to `true`.
     * @returns a readonly array of facilities
     */
    loadFacilities(_0) {
      return __async(this, arguments, function* (ident, facilitySearchType = import_msfs_sdk.FacilitySearchType.All, excludeTerminalFacilities = true) {
        if (this.facilityLoader === null) {
          return Promise.resolve([]);
        }
        const icaos = yield this.facilityLoader.searchByIdent(facilitySearchType, ident, 15);
        let facilities = yield Promise.all(
          icaos.map((icao) => {
            if (this.facilityLoader === null) {
              return;
            }
            return this.facilityLoader.getFacility(import_msfs_sdk.ICAO.getFacilityTypeFromStringV1(icao), icao);
          })
        );
        facilities.sort((a, b) => this.orderByIdentsAndDistance(a, b));
        excludeTerminalFacilities && (facilities = facilities.filter((fac) => fac.icaoStruct.airport === ""));
        return facilities;
      });
    }
  };
  _FacilitySearchUtils.INSTANCE = null;
  var _SearchFacilityHistoryManager = class _SearchFacilityHistoryManager2 {
    constructor() {
      this.MAX_ITEMS_STORED = 5;
      this.storedICAOs = import_msfs_sdk.ArraySubject.create();
      this.loadICAOsFromStorage();
    }
    /**
     * Retrieves all the stored recent searches
     */
    loadICAOsFromStorage() {
      let arrayICAOs = [];
      const stringICAOs = import_msfs_sdk.DataStore.get(_SearchFacilityHistoryManager2.DATASTORE_KEY);
      if (stringICAOs === void 0 || typeof stringICAOs !== "string") {
        this.storedICAOs.set(arrayICAOs);
        return;
      }
      try {
        arrayICAOs = JSON.parse(stringICAOs);
      } catch (e) {
        console.error("JSON failed, impossible to parse : ", stringICAOs);
      }
      this.storedICAOs.set(arrayICAOs);
    }
    saveICAOsToStorage() {
      const stringICAOs = JSON.stringify(this.storedICAOs.getArray());
      import_msfs_sdk.DataStore.set(_SearchFacilityHistoryManager2.DATASTORE_KEY, stringICAOs);
    }
    mostRecentSearch(icao) {
      const foundIndex = this.storedICAOs.getArray().findIndex((storedIcao) => storedIcao === icao);
      if (foundIndex !== -1) {
        this.storedICAOs.removeAt(foundIndex);
      }
      this.storedICAOs.insert(icao, 0);
      while (this.storedICAOs.length > this.MAX_ITEMS_STORED) {
        this.storedICAOs.removeAt(this.MAX_ITEMS_STORED);
      }
      this.saveICAOsToStorage();
    }
    /**
     * Retrieve the search facility history as an array
     * @param input the input of the search
     * @param max_items the maximum number of items returned
     * @returns the recent searches as an array of icaos
     */
    getStoredICAOs(input, max_items = this.MAX_ITEMS_STORED) {
      this.loadICAOsFromStorage();
      return this.storedICAOs.getArray().filter((icao) => import_msfs_sdk.ICAO.getIdent(icao).startsWith(input.toUpperCase())).slice(0, max_items);
    }
  };
  _SearchFacilityHistoryManager.DATASTORE_KEY = "efb.search-bar-history";
  var uid = 0;
  var Container = class _Container {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
      this._uid = uid++;
      this._registeredAppsPromises = [];
      this._installedApps = import_msfs_sdk.ArraySubject.create();
    }
    /**
     * Static singleton instance of Efb container
     * @internal
     */
    static get instance() {
      return window.EFB_API = _Container._instance = window.EFB_API || _Container._instance || new _Container();
    }
    /** @internal */
    apps() {
      return this._installedApps;
    }
    /** @internal */
    allAppsLoaded() {
      return this._registeredAppsPromises.length === this._installedApps.length;
    }
    /**
     * Method used by the OS to share the bus to apps
     * @internal
     */
    setBus(bus) {
      this.bus = bus;
      return this;
    }
    /**
     * Method used by the OS to share the units settings manager to the apps
     * @internal
     */
    setUnitsSettingManager(unitsSettingManager) {
      this.unitsSettingManager = unitsSettingManager;
      return this;
    }
    /**
     * Method used by the OS to share the settings manager to the apps
     * @internal
     */
    setEfbSettingManager(efbSettingsManager) {
      this.efbSettingsManager = efbSettingsManager;
      return this;
    }
    setOnboardingManager(onboardingManager) {
      this.onboardingManager = onboardingManager;
      return this;
    }
    /**
     * Method used by the OS to share the notification manager to the apps
     * @internal
     */
    setNotificationManager(notificationManager) {
      this.notificationManager = notificationManager;
      return this;
    }
    /**
     * Load stylesheet
     * @param uri
     * @returns Promise which is resolved when stylesheet is loaded or rejected if an error occur.
     */
    loadCss(uri) {
      return __async(this, null, function* () {
        if (document.querySelector(`link[href*="${uri}"]`)) {
          return Promise.reject(`${uri} already loaded.`);
        }
        const linkTag = document.createElement("link");
        linkTag.rel = "stylesheet";
        linkTag.href = uri;
        document.head.append(linkTag);
        return new Promise((resolve, reject) => {
          linkTag.onload = () => resolve();
          linkTag.onerror = reject;
        });
      });
    }
    /**
     * Load script file
     * @param uri
     * @returns Promise which is resolved when script is loaded or rejected if an error occur.
     */
    loadJs(uri) {
      return __async(this, null, function* () {
        if (document.querySelector(`script[src*="${uri}"]`)) {
          return Promise.reject(`${uri} already loaded.`);
        }
        const scriptTag = document.createElement("script");
        scriptTag.type = "text/javascript";
        scriptTag.src = uri;
        document.head.append(scriptTag);
        return new Promise((resolve, reject) => {
          scriptTag.onload = () => resolve();
          scriptTag.onerror = reject;
        });
      });
    }
    /**
     * Register an app in EFB
     * @template T - App registration options
     * @param app The app you wan't to register
     * @param options Options you'r app might need when installing
     * @returns EFB instance
     * @throws Throw an error if App install went wrong.
     */
    use(app, ...options) {
      var _a;
      try {
        if (!this.bus) {
          throw new Error(`Bus has not been initialized yet.`);
        }
        const appInstance = app instanceof App ? app : new app();
        const installProps = {
          bus: this.bus,
          unitsSettingManager: this.unitsSettingManager,
          efbSettingsManager: this.efbSettingsManager,
          notificationManager: this.notificationManager,
          onboardingManager: this.onboardingManager,
          options: Object.keys(options).filter((key) => key !== "isCoreApp").reduce((acc, key) => {
            return Object.assign(acc, options[key]);
          }, {})
        };
        const appInstaller = appInstance._install.apply(appInstance, [installProps]);
        const name = appInstance.internalName;
        if (/\s/.test(name)) {
          throw new Error(`The App name can't have any whitespace character. "${name}"`);
        }
        if (!Object.prototype.hasOwnProperty.call(installProps.options, "isCoreApp")) {
          this._registeredAppsPromises.push(
            appInstaller.then(() => {
              this._installedApps.insert(appInstance);
            })
          );
        }
      } catch (e) {
        (_a = document.currentScript) == null ? void 0 : _a.remove();
        console.error(`App can't be installed`, e);
        throw e;
      }
      return this;
    }
  };
  var Efb = Container.instance;
  var _OnboardingManager = class _OnboardingManager2 {
    constructor() {
      this.isStarted = false;
      this.stepIndex = 0;
      this.steps = [];
    }
    static getManager() {
      var _a;
      return (_a = _OnboardingManager2.INSTANCE) != null ? _a : _OnboardingManager2.INSTANCE = new _OnboardingManager2();
    }
    bindContainer(containerRef) {
      _OnboardingManager2.getManager().containerRef = containerRef;
    }
    start(onboarding) {
      const onboardingManager = _OnboardingManager2.getManager();
      onboardingManager.steps = onboarding.steps.map((step) => {
        return __spreadProps(__spreadValues({}, step), { actions: [...step.actions] });
      });
      if (!onboardingManager.containerRef) {
        console.warn("Onboarding container not bound");
        return;
      }
      if (!onboardingManager.steps.length) {
        console.warn("No onboarding steps provided");
        return;
      }
      if (onboardingManager.isStarted) {
        console.warn("Onboarding already started");
        return;
      }
      onboardingManager.stepIndex = 0;
      onboardingManager.isStarted = true;
      onboardingManager.onFinish = onboarding.onFinish;
      onboardingManager.steps[onboardingManager.stepIndex].actions.unshift(
        {
          key: "@fs-base-efb,TT:EFB.COMMON.QUICK_TOUR_AROUND",
          callback: () => {
            onboardingManager.next();
          }
        },
        {
          key: "@fs-base-efb,TT:EFB.COMMON.SKIP",
          callback: () => {
            onboardingManager.stop();
          }
        }
      );
      onboardingManager.containerRef.instance.show();
      onboardingManager.containerRef.instance.setStep(onboardingManager.steps[onboardingManager.stepIndex]);
      onboardingManager.stepIndex++;
      return;
    }
    next() {
      var _a;
      const onboardingManager = _OnboardingManager2.getManager();
      if (!onboardingManager.isStarted) {
        console.warn("Onboarding not started. You should call start method first");
        return;
      }
      if (onboardingManager.stepIndex >= onboardingManager.steps.length) {
        onboardingManager.stop();
        return;
      }
      onboardingManager.steps[onboardingManager.stepIndex].actions.unshift({
        key: "@fs-base-efb,TT:EFB.COMMON.NEXT",
        callback: () => {
          onboardingManager.next();
        }
      });
      (_a = onboardingManager.containerRef) == null ? void 0 : _a.instance.setStep(onboardingManager.steps[onboardingManager.stepIndex]);
      onboardingManager.stepIndex++;
      return;
    }
    stop() {
      var _a, _b;
      const onboardingManager = _OnboardingManager2.getManager();
      onboardingManager.isStarted = false;
      onboardingManager.steps = [];
      (_a = onboardingManager.containerRef) == null ? void 0 : _a.instance.hide();
      (_b = onboardingManager.onFinish) == null ? void 0 : _b.call(onboardingManager);
    }
  };
  _OnboardingManager.INSTANCE = void 0;
  var UnitsNavAngleSettingMode = /* @__PURE__ */ ((UnitsNavAngleSettingMode2) => {
    UnitsNavAngleSettingMode2["Magnetic"] = "magnetic";
    UnitsNavAngleSettingMode2["True"] = "true";
    return UnitsNavAngleSettingMode2;
  })(UnitsNavAngleSettingMode || {});
  var UnitsSpeedSettingMode = /* @__PURE__ */ ((UnitsSpeedSettingMode2) => {
    UnitsSpeedSettingMode2["Nautical"] = "KTS";
    UnitsSpeedSettingMode2["Metric"] = "KPH";
    return UnitsSpeedSettingMode2;
  })(UnitsSpeedSettingMode || {});
  var UnitsDistanceSettingMode = /* @__PURE__ */ ((UnitsDistanceSettingMode2) => {
    UnitsDistanceSettingMode2["Nautical"] = "NM";
    UnitsDistanceSettingMode2["Metric"] = "KM";
    return UnitsDistanceSettingMode2;
  })(UnitsDistanceSettingMode || {});
  var UnitsSmallDistanceSettingMode = /* @__PURE__ */ ((UnitsSmallDistanceSettingMode2) => {
    UnitsSmallDistanceSettingMode2["Feet"] = "FT";
    UnitsSmallDistanceSettingMode2["Meters"] = "M";
    return UnitsSmallDistanceSettingMode2;
  })(UnitsSmallDistanceSettingMode || {});
  var UnitsAltitudeSettingMode = /* @__PURE__ */ ((UnitsAltitudeSettingMode2) => {
    UnitsAltitudeSettingMode2["Feet"] = "FT";
    UnitsAltitudeSettingMode2["Meters"] = "M";
    return UnitsAltitudeSettingMode2;
  })(UnitsAltitudeSettingMode || {});
  var UnitsWeightSettingMode = /* @__PURE__ */ ((UnitsWeightSettingMode2) => {
    UnitsWeightSettingMode2["Pounds"] = "LBS";
    UnitsWeightSettingMode2["Kilograms"] = "KG";
    return UnitsWeightSettingMode2;
  })(UnitsWeightSettingMode || {});
  var UnitsVolumeSettingMode = /* @__PURE__ */ ((UnitsVolumeSettingMode2) => {
    UnitsVolumeSettingMode2["Gallons"] = "GAL US";
    UnitsVolumeSettingMode2["Liters"] = "L";
    return UnitsVolumeSettingMode2;
  })(UnitsVolumeSettingMode || {});
  var UnitsTemperatureSettingMode = /* @__PURE__ */ ((UnitsTemperatureSettingMode2) => {
    UnitsTemperatureSettingMode2["Fahrenheit"] = "\xB0F";
    UnitsTemperatureSettingMode2["Celsius"] = "\xB0C";
    return UnitsTemperatureSettingMode2;
  })(UnitsTemperatureSettingMode || {});
  var UnitsTimeSettingMode = /* @__PURE__ */ ((UnitsTimeSettingMode2) => {
    UnitsTimeSettingMode2["Local12"] = "local-12";
    UnitsTimeSettingMode2["Local24"] = "local-24";
    return UnitsTimeSettingMode2;
  })(UnitsTimeSettingMode || {});
  var _UnitsSettingsManager = class _UnitsSettingsManager2 extends import_msfs_sdk.DefaultUserSettingManager {
    constructor(bus, settingsDefs) {
      super(bus, settingsDefs, true);
      this.navAngleUnitsSub = import_msfs_sdk.Subject.create(_UnitsSettingsManager2.MAGNETIC_BEARING);
      this.navAngleUnits = this.navAngleUnitsSub;
      this.timeUnitsSub = import_msfs_sdk.Subject.create(
        "local-12"
        /* Local12 */
      );
      this._timeUnits = this.timeUnitsSub;
      this.areSubscribablesInit = false;
      this.areSubscribablesInit = true;
      for (const entry of this.settings.values()) {
        this.updateUnitsSubjects(entry.setting.definition.name, entry.setting.value);
      }
    }
    onSettingValueChanged(entry, value2) {
      if (this.areSubscribablesInit) {
        this.updateUnitsSubjects(entry.setting.definition.name, value2);
      }
      super.onSettingValueChanged(entry, value2);
    }
    /**
     * Checks if the values loaded from the datastorage correspond to the settings types.
     */
    checkLoadedValues() {
      checkUserSetting(this.getSetting("unitsNavAngle"), UnitsNavAngleSettingMode);
      checkUserSetting(this.getSetting("unitsSpeed"), UnitsSpeedSettingMode);
      checkUserSetting(this.getSetting("unitsDistance"), UnitsDistanceSettingMode);
      checkUserSetting(this.getSetting("unitsAltitude"), UnitsAltitudeSettingMode);
      checkUserSetting(this.getSetting("unitsSmallDistance"), UnitsSmallDistanceSettingMode);
      checkUserSetting(this.getSetting("unitsWeight"), UnitsWeightSettingMode);
      checkUserSetting(this.getSetting("unitsVolume"), UnitsVolumeSettingMode);
      checkUserSetting(this.getSetting("unitsTemperature"), UnitsTemperatureSettingMode);
      checkUserSetting(this.getSetting("unitsTime"), UnitsTimeSettingMode);
    }
    updateUnitsSubjects(settingName, value2) {
      switch (settingName) {
        case "unitsNavAngle":
          this.navAngleUnitsSub.set(
            value2 === "true" ? _UnitsSettingsManager2.TRUE_BEARING : _UnitsSettingsManager2.MAGNETIC_BEARING
          );
          break;
        case "unitsTime":
          this.timeUnitsSub.set(value2);
          break;
        case "unitsDistance":
          this.getSetting("unitsSmallDistance").set(
            value2 === "NM" ? "FT" : "M"
            /* Meters */
          );
      }
    }
    /**
     * Gets a unit type subscribable from a unit setting name
     * @param settingName the name of the unit setting
     * @returns a Subscribable containing the unit type. If the value in the dataStorage is unvalid, it returns the default unitType
     */
    getSettingUnitType(settingName) {
      const setting = this.getSetting(settingName);
      return setting.map(
        (settingValue) => {
          var _a;
          return (_a = UnitTypesMap[settingValue]) != null ? _a : UnitTypesMap[setting.definition.defaultValue];
        }
      );
    }
  };
  _UnitsSettingsManager.TRUE_BEARING = import_msfs_sdk.BasicNavAngleUnit.create(false);
  _UnitsSettingsManager.MAGNETIC_BEARING = import_msfs_sdk.BasicNavAngleUnit.create(true);
  var UnitTypesMap = {
    /** Mapped speed unit types */
    KTS: import_msfs_sdk.UnitType.KNOT,
    KPH: import_msfs_sdk.UnitType.KPH,
    /** Mapped distance unit type */
    NM: import_msfs_sdk.UnitType.NMILE,
    KM: import_msfs_sdk.UnitType.KILOMETER,
    /** Mapped altitude unit type */
    FT: import_msfs_sdk.UnitType.FOOT,
    M: import_msfs_sdk.UnitType.METER,
    /** Mapped weight unit type */
    LBS: import_msfs_sdk.UnitType.POUND,
    KG: import_msfs_sdk.UnitType.KILOGRAM,
    /** Mapped volume unit type */
    "GAL US": import_msfs_sdk.UnitType.GALLON,
    L: import_msfs_sdk.UnitType.LITER,
    /** Mapped temperature unit type */
    "\xB0C": import_msfs_sdk.UnitType.CELSIUS,
    "\xB0F": import_msfs_sdk.UnitType.FAHRENHEIT
  };

  // src/ScientificEquipmentApp.tsx
  var import_msfs_sdk2 = __toESM(require_msfssdk(), 1);

  // src/equipment.ts
  var equipment = [
    { key: "LIDAR", circuit: "Scientific_LiDAR", line: "Scientific_LiDAR_Line", label: "LiDAR", watts: 550 },
    { key: "CAMERA", circuit: "Scientific_Camera", line: "Scientific_Camera_Line", label: "Camera", watts: 400 }
  ];
  var local = (key) => `L:C208_SCI_${key}`;
  var named = (variable, component) => `${variable}:'${component}'_n`;
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

  // src/sim.ts
  function read(name, unit = "number") {
    const value2 = SimVar.GetSimVarValue(name, unit);
    if (typeof value2 === "boolean") return Number(value2);
    if (typeof value2 !== "number" || !Number.isFinite(value2)) {
      throw new Error(`Invalid SimVar read: ${name}`);
    }
    return value2;
  }
  function write(name, value2, unit = "number") {
    return __async(this, null, function* () {
      yield SimVar.SetSimVarValue(name, unit, value2);
    });
  }

  // src/ScientificEquipmentApp.tsx
  var baseUrl = "coui://html_ui/efb_ui/efb_apps/ScientificEquipment";
  var ScientificEquipmentView = class extends AppView {
    constructor() {
      super(...arguments);
      this.crew = import_msfs_sdk2.Subject.create("Waiting for aircraft controller");
      this.error = import_msfs_sdk2.Subject.create("");
      this.disabled = import_msfs_sdk2.Subject.create(true);
      this.rows = equipment.map((item) => ({
        item,
        command: import_msfs_sdk2.Subject.create("Command: OFF"),
        state: import_msfs_sdk2.Subject.create("NOT POWERED"),
        power: import_msfs_sdk2.Subject.create("0.0 V / 0.0 A")
      }));
      this.heartbeat = NaN;
      this.heartbeatSeen = -Infinity;
      this.lastUpdate = -Infinity;
      this.lastError = "";
    }
    toggle(item) {
      return __async(this, null, function* () {
        try {
          yield write(local(`${item.key}_REQUESTED`), read(local(`${item.key}_REQUESTED`)) === 1 ? 0 : 1);
        } catch (error) {
          this.showError(error);
        }
      });
    }
    showError(error) {
      const message = error instanceof Error ? error.message : String(error);
      this.error.set(message);
      this.disabled.set(true);
      if (message !== this.lastError) console.error(`[Scientific Equipment EFB] ${message}`);
      this.lastError = message;
    }
    onUpdate(time) {
      var _a;
      super.onUpdate(time);
      const now = performance.now();
      if (now - this.lastUpdate < 200) return;
      this.lastUpdate = now;
      try {
        const heartbeat = read(local("HEARTBEAT"));
        if (heartbeat > 0 && heartbeat !== this.heartbeat) {
          this.heartbeat = heartbeat;
          this.heartbeatSeen = now;
        }
        const active = now - this.heartbeatSeen < 2e3;
        this.disabled.set(!active);
        this.error.set(active ? "" : "Scientific aircraft controller unavailable. Select the scientific variant in free flight.");
        this.crew.set(!active ? "Aircraft not ready" : read(local("CREW_KNOWN")) !== 1 ? "Crew data unavailable - equipment inhibited" : read(local("CREW_PRESENT")) === 1 ? "Specialist A present. Specialist B optional." : "Load Specialist A at the operator console. Specialist B cannot substitute.");
        for (const row of this.rows) {
          row.command.set(`Command: ${read(local(`${row.item.key}_REQUESTED`)) === 1 ? "ON" : "OFF"}`);
          const status = read(local(`${row.item.key}_STATUS`));
          row.state.set(active ? (_a = messages[status]) != null ? _a : "Unknown equipment state" : "POWER STATE UNKNOWN");
          const voltage = read(named("ELECTRICAL CIRCUIT VOLTAGE", row.item.circuit), "volts");
          const amps = read(named("ELECTRICAL CIRCUIT AMPS", row.item.circuit), "amperes");
          row.power.set(active ? `${voltage.toFixed(1)} V / ${amps.toFixed(1)} A` : "-- V / -- A");
        }
      } catch (error) {
        this.showError(error);
      }
    }
    render() {
      return this.content = /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("div", { ref: this.rootRef, class: "scientific-equipment" }, /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("h1", null, "Scientific Equipment"), /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("p", null, this.crew), /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("p", { class: "scientific-error" }, this.error), this.rows.map((row) => /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("section", null, /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("h2", null, row.item.label), /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("p", null, "Modelled load: ", row.item.watts, " W (mount excluded)"), /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent(Button, { disabled: this.disabled, callback: () => {
        void this.toggle(row.item);
      } }, row.command), /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("p", { class: "scientific-state" }, row.state), /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("p", null, row.power))), /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("p", null, "Main generator or connected external ground power required. Battery and standby-only operation are inhibited."), /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent("p", null, "ON is a request, not proof of power. Pending ON requests resume when crew and power return. Set OFF before loading crew, restoring power or servicing breakers."));
    }
    destroy() {
      if (this.content) import_msfs_sdk2.FSComponent.shallowDestroy(this.content);
      super.destroy();
    }
  };
  var ScientificEquipmentApp = class extends App {
    get name() {
      return "Scientific Equipment";
    }
    get internalName() {
      return "C208ScientificEquipment";
    }
    get icon() {
      return `${baseUrl}/ScientificEquipment.svg`;
    }
    getVersion() {
      return "0.2.0";
    }
    install() {
      return __async(this, null, function* () {
        yield Efb.loadCss(`${baseUrl}/ScientificEquipment.css`);
      });
    }
    render() {
      return /* @__PURE__ */ import_msfs_sdk2.FSComponent.buildComponent(ScientificEquipmentView, { bus: this.bus });
    }
  };
  Efb.use(ScientificEquipmentApp);
})();
