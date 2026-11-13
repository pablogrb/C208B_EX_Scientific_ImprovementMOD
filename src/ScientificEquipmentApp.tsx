import { App, AppView, Button, Efb } from '@microsoft/msfs-efb-api';
import { FSComponent, Subject } from '@microsoft/msfs-sdk';
import type { VNode } from '@microsoft/msfs-sdk';
import { equipment, local, messages, named, Status } from './equipment';
import type { Equipment } from './equipment';
import { read, write } from './sim';

const baseUrl = 'coui://html_ui/efb_ui/efb_apps/ScientificEquipment';

class ScientificEquipmentView extends AppView {
  private readonly crew = Subject.create('Waiting for aircraft controller');
  private readonly error = Subject.create('');
  private readonly disabled = Subject.create(true);
  private readonly rows = equipment.map(item => ({
    item,
    command: Subject.create('Command: OFF'),
    state: Subject.create('NOT POWERED'),
    power: Subject.create('0.0 V / 0.0 A')
  }));
  private heartbeat = NaN;
  private heartbeatSeen = -Infinity;
  private lastUpdate = -Infinity;
  private lastError = '';
  private content?: VNode;

  private async toggle(item: Equipment): Promise<void> {
    try {
      await write(local(`${item.key}_REQUESTED`), read(local(`${item.key}_REQUESTED`)) === 1 ? 0 : 1);
    } catch (error) {
      this.showError(error);
    }
  }

  private showError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.error.set(message);
    this.disabled.set(true);
    if (message !== this.lastError) console.error(`[Scientific Equipment EFB] ${message}`);
    this.lastError = message;
  }

  onUpdate(time: number): void {
    super.onUpdate(time);
    const now = performance.now();
    if (now - this.lastUpdate < 200) return;
    this.lastUpdate = now;
    try {
      const heartbeat = read(local('HEARTBEAT'));
      if (heartbeat > 0 && heartbeat !== this.heartbeat) {
        this.heartbeat = heartbeat;
        this.heartbeatSeen = now;
      }
      const active = now - this.heartbeatSeen < 2000;
      this.disabled.set(!active);
      this.error.set(active ? '' : 'Scientific aircraft controller unavailable. Select the scientific variant in free flight.');
      this.crew.set(!active ? 'Aircraft not ready'
        : read(local('CREW_KNOWN')) !== 1 ? 'Crew data unavailable - equipment inhibited'
        : read(local('CREW_PRESENT')) === 1 ? 'Specialist A present. Specialist B optional.'
        : 'Load Specialist A at the operator console. Specialist B cannot substitute.');
      for (const row of this.rows) {
        row.command.set(`Command: ${read(local(`${row.item.key}_REQUESTED`)) === 1 ? 'ON' : 'OFF'}`);
        const status = read(local(`${row.item.key}_STATUS`));
        row.state.set(active ? messages[status as Status] ?? 'Unknown equipment state' : 'POWER STATE UNKNOWN');
        const voltage = read(named('ELECTRICAL CIRCUIT VOLTAGE', row.item.circuit), 'volts');
        const amps = read(named('ELECTRICAL CIRCUIT AMPS', row.item.circuit), 'amperes');
        row.power.set(active ? `${voltage.toFixed(1)} V / ${amps.toFixed(1)} A` : '-- V / -- A');
      }
    } catch (error) {
      this.showError(error);
    }
  }

  render() {
    return this.content = <div ref={this.rootRef} class="scientific-equipment">
      <h1>Scientific Equipment</h1>
      <p>{this.crew}</p>
      <p class="scientific-error">{this.error}</p>
      {this.rows.map(row => <section>
        <h2>{row.item.label}</h2>
        <p>Modelled load: {row.item.watts} W (mount excluded)</p>
        <Button disabled={this.disabled} callback={() => { void this.toggle(row.item); }}>
          {row.command}
        </Button>
        <p class="scientific-state">{row.state}</p>
        <p>{row.power}</p>
      </section>)}
      <p>Main generator or connected external ground power required. Battery and standby-only operation are inhibited.</p>
      <p>ON is a request, not proof of power. Pending ON requests resume when crew and power return.
        Set OFF before loading crew, restoring power or servicing breakers.</p>
    </div>;
  }

  destroy(): void {
    if (this.content) FSComponent.shallowDestroy(this.content);
    super.destroy();
  }
}

class ScientificEquipmentApp extends App {
  get name(): string { return 'Scientific Equipment'; }
  get internalName(): string { return 'C208ScientificEquipment'; }
  get icon(): string { return `${baseUrl}/ScientificEquipment.svg`; }
  getVersion(): string { return '0.2.0'; }
  async install(): Promise<void> {
    await Efb.loadCss(`${baseUrl}/ScientificEquipment.css`);
  }
  render() {
    return <ScientificEquipmentView bus={this.bus} />;
  }
}

Efb.use(ScientificEquipmentApp);
