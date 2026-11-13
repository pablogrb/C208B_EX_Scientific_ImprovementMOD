import { equipment, evaluate, local, named, specialistAPresent, Status } from './equipment';
import type { SeatGroup } from './equipment';
import { read, write } from './sim';

class C208ScientificController extends BaseInstrument {
  private listener?: ReturnType<typeof RegisterViewListener>;
  private crewPresent = false;
  private crewUpdated = -Infinity;
  private lastPoll = -Infinity;
  private polling = false;
  private updating = false;
  private lastUpdate = -Infinity;
  private error = '';

  get templateID(): string { return 'C208ScientificController'; }
  get isInteractive(): boolean { return false; }

  connectedCallback(): void {
    super.connectedCallback();
    this.listener = RegisterViewListener('JS_LISTENER_MASS_AND_BALANCE', () => {
      this.listener?.on('SEATS_UPDATED', () => {
        this.crewUpdated = -Infinity;
        this.lastPoll = -Infinity;
      });
    });
  }

  protected isElectricityAvailable(): boolean { return true; }

  protected Update(): void {
    super.Update();
    const now = performance.now();
    if (now - this.lastPoll >= 500 && !this.polling && this.listener) {
      this.lastPoll = now;
      void this.pollCrew();
    }
    if (now - this.lastUpdate < 100 || this.updating) return;
    this.lastUpdate = now;
    this.updating = true;
    void this.updateEquipment(now).catch(error => this.failClosed(error)).then(() => {
      this.updating = false;
    }, error => {
      this.report(error);
      this.updating = false;
    });
  }

  private async pollCrew(): Promise<void> {
    this.polling = true;
    try {
      const groups: SeatGroup[] = await this.listener!.call('GET_SEATS');
      this.crewPresent = specialistAPresent(groups);
      this.crewUpdated = performance.now();
      this.error = '';
    } catch (error) {
      this.crewUpdated = -Infinity;
      this.report(error);
    } finally {
      this.polling = false;
    }
  }

  private report(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    if (message !== this.error) console.error(`[C208 Scientific Equipment] ${message}`);
    this.error = message;
  }

  private async failClosed(error: unknown): Promise<void> {
    this.report(error);
    const operations = [write(local('ERROR'), 1)];
    for (const item of equipment) {
      operations.push(
        write(named('CIRCUIT SWITCH ON', item.circuit), 0, 'Bool'),
        write(local(`${item.key}_POWERED`), 0),
        write(local(`${item.key}_STATUS`), Status.ControllerError)
      );
    }
    await Promise.all(operations.map(operation => operation.catch(error => this.report(error))));
  }

  private async updateEquipment(now: number): Promise<void> {
    const crewKnown = now - this.crewUpdated <= 1500;
    const generator = read(named('ELECTRICAL GENERATOR ACTIVE', 'StarterGenerator'), 'Bool') === 1
      && read(named('ELECTRICAL GENERATOR SWITCH', 'StarterGenerator'), 'Bool') === 1
      && read(named('LINE CONNECTION ON', 'StarterGenerator_To_PWR_BUS_DISTRIB'), 'Bool') === 1
      && read(named('LINE BREAKER PULLED', 'StarterGenerator_To_PWR_BUS_DISTRIB'), 'Bool') === 0
      && read(named('ELECTRICAL GENERATOR VOLTAGE', 'StarterGenerator'), 'volts') >= 20;
    const external = read(named('EXTERNAL POWER AVAILABLE', 'ExternalPower'), 'Bool') === 1
      && read(named('EXTERNAL POWER ON', 'ExternalPower'), 'Bool') === 1
      && read(named('EXTERNAL POWER CONNECTION ON', 'ExternalPower'), 'Bool') === 1
      && read(named('ELECTRICAL EXTERNAL POWER VOLTAGE', 'ExternalPower'), 'volts') >= 20;
    const feedOpen = read(named('LINE BREAKER PULLED', 'Scientific_Feed'), 'Bool') === 1;
    const busVoltage = read(named('ELECTRICAL BUS VOLTAGE', 'Scientific_Equipment_Bus'), 'volts');
    await write(local('CREW_KNOWN'), Number(crewKnown));
    await write(local('CREW_PRESENT'), Number(crewKnown && this.crewPresent));
    await write(local('SOURCE_AVAILABLE'), Number(generator || external));
    await write(local('ERROR'), Number(!crewKnown && this.error !== ''));

    for (const item of equipment) {
      const result = evaluate({
        requested: read(local(`${item.key}_REQUESTED`)) === 1,
        crewKnown,
        crewPresent: this.crewPresent,
        sourceAvailable: generator || external,
        busVoltage,
        feedOpen,
        branchOpen: read(named('LINE BREAKER PULLED', item.line), 'Bool') === 1,
        voltage: read(named('ELECTRICAL CIRCUIT VOLTAGE', item.circuit), 'volts'),
        circuitOn: read(named('CIRCUIT ON', item.circuit), 'Bool') === 1,
        amps: read(named('ELECTRICAL CIRCUIT AMPS', item.circuit), 'amperes')
      });
      if (read(named('CIRCUIT SWITCH ON', item.circuit), 'Bool') !== Number(result.enable)) {
        await write(named('CIRCUIT SWITCH ON', item.circuit), Number(result.enable), 'Bool');
      }
      await write(local(`${item.key}_POWERED`), Number(result.powered));
      await write(local(`${item.key}_STATUS`), result.status);
    }
    await write(local('HEARTBEAT'), now);
  }
}

registerInstrument('c208-scientific-controller', C208ScientificController);
