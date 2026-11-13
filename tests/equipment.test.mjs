import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { build } from 'esbuild';

const coreBuild = await build({
  entryPoints: ['src/equipment.ts'], bundle: true, write: false, format: 'esm', platform: 'node'
});
const { evaluate, equipment, local, named, specialistAPresent, Status } = await import(
  `data:text/javascript;base64,${Buffer.from(coreBuild.outputFiles[0].text).toString('base64')}`
);
const controllerBuild = await build({
  entryPoints: ['src/Controller.ts'], bundle: true, write: false, format: 'iife', target: 'es2015'
});
const section = (name, occupied) => ({
  name, occupation: Number(occupied), configured_occupation: 1,
  current_mass: occupied ? 170 : 0, seats: [{ is_occupied: occupied }]
});
const seats = (a, b) => [{
  name: 'TT:DEFAULT DECK', sections: [
    section('TT:MENU.PAYLOAD.PASSENGER_03', a),
    section('TT:MENU.PAYLOAD.PASSENGER_04', b)
  ]
}];

test('only live Specialist A occupancy authorizes operation', () => {
  assert.equal(specialistAPresent(seats(false, true)), false);
  assert.equal(specialistAPresent(seats(true, false)), true);
  assert.equal(specialistAPresent(seats(true, true)), true);
  assert.throws(() => specialistAPresent([]), /found 0/);
  assert.throws(() => specialistAPresent([...seats(true, false), ...seats(true, false)]), /found 2/);
  const invalid = seats(true, false);
  invalid[0].sections[0].occupation = NaN;
  assert.throws(() => specialistAPresent(invalid), /Invalid/);
});

test('ON commands cannot masquerade as actual power', () => {
  const input = {
    requested: true, crewKnown: true, crewPresent: true, sourceAvailable: true,
    busVoltage: 28, feedOpen: false, branchOpen: false, voltage: 28, circuitOn: true, amps: 19.64
  };
  assert.equal(evaluate(input).status, Status.Powered);
  for (const change of [
    { circuitOn: false }, { voltage: 19.99 }, { voltage: 32.01 }, { amps: 0 },
    { feedOpen: true }, { branchOpen: true }, { busVoltage: 0 },
    { requested: false }, { crewKnown: false }, { crewPresent: false }, { sourceAvailable: false }
  ]) {
    assert.equal(evaluate({ ...input, ...change }).powered, false, JSON.stringify(change));
  }
  for (const voltage of [20, 32]) {
    assert.equal(evaluate({ ...input, busVoltage: voltage, voltage }).powered, true);
  }
});

function harness() {
  let now = 100;
  let Controller;
  let registered;
  const values = new Map([
    [named('ELECTRICAL GENERATOR ACTIVE', 'StarterGenerator'), 1],
    [named('ELECTRICAL GENERATOR SWITCH', 'StarterGenerator'), 1],
    [named('ELECTRICAL GENERATOR VOLTAGE', 'StarterGenerator'), 28],
    [named('LINE CONNECTION ON', 'StarterGenerator_To_PWR_BUS_DISTRIB'), 1],
    [named('ELECTRICAL BUS VOLTAGE', 'Scientific_Equipment_Bus'), 28]
  ]);
  const writes = [];
  const errors = [];
  const state = { groups: seats(true, false), rejectSeats: false, stallSeats: false, invalidRead: '' };
  const events = new Map();
  const listener = {
    on(name, callback) { events.set(name, callback); },
    async call(name) {
      assert.equal(name, 'GET_SEATS');
      if (state.stallSeats) return new Promise(() => {});
      if (state.rejectSeats) throw new Error('Crew listener failed');
      return state.groups;
    }
  };
  const context = vm.createContext({
    BaseInstrument: class {
      connectedCallback() {}
      Update() {}
    },
    performance: { now: () => now },
    console: { error: message => errors.push(message) },
    RegisterViewListener(name, callback) {
      assert.equal(name, 'JS_LISTENER_MASS_AND_BALANCE');
      registered = callback;
      return listener;
    },
    registerInstrument(name, constructor) {
      assert.equal(name, 'c208-scientific-controller');
      Controller = constructor;
    },
    SimVar: {
      GetSimVarValue(name) {
        if (name === state.invalidRead) return null;
        return values.get(name) ?? 0;
      },
      async SetSimVarValue(name, unit, value) {
        writes.push({ name, unit, value });
        values.set(name, value);
      }
    }
  });
  vm.runInContext('Array.prototype.flatMap = undefined; Promise.prototype.finally = undefined; Promise.allSettled = undefined;', context);
  vm.runInContext(controllerBuild.outputFiles[0].text, context);
  const controller = new Controller();
  controller.connectedCallback();
  registered();
  return {
    values, writes, errors, state,
    async tick(milliseconds = 100) {
      now += milliseconds;
      controller.Update();
      await new Promise(resolve => setImmediate(resolve));
    },
    refreshSeats() { events.get('SEATS_UPDATED')(); },
    setPowered(item, powered) {
      values.set(named('CIRCUIT ON', item.circuit), Number(powered));
      values.set(named('ELECTRICAL CIRCUIT VOLTAGE', item.circuit), powered ? 28 : 0);
      values.set(named('ELECTRICAL CIRCUIT AMPS', item.circuit), powered ? item.watts / 28 : 0);
    }
  };
}

test('aircraft controller operates independent switches without an EFB instance', async () => {
  const h = harness();
  const [lidar, camera] = equipment;
  h.values.set(local('LIDAR_REQUESTED'), 1);
  await h.tick();
  await h.tick();
  assert.equal(h.values.get(named('CIRCUIT SWITCH ON', lidar.circuit)), 1);
  assert.equal(h.values.get(local('LIDAR_POWERED')), 0);
  assert.equal(h.values.get(named('CIRCUIT SWITCH ON', camera.circuit)) ?? 0, 0);
  h.setPowered(lidar, true);
  await h.tick();
  assert.equal(h.values.get(local('LIDAR_POWERED')), 1);
  h.values.set(local('CAMERA_REQUESTED'), 1);
  await h.tick();
  assert.equal(h.values.get(named('CIRCUIT SWITCH ON', camera.circuit)), 1);
  h.setPowered(camera, true);
  h.values.set(local('LIDAR_REQUESTED'), 0);
  await h.tick();
  assert.equal(h.values.get(named('CIRCUIT SWITCH ON', lidar.circuit)), 0);
  assert.equal(h.values.get(local('CAMERA_POWERED')), 1);
});

test('removing A cuts both native switches, even with B present and the EFB closed', async () => {
  const h = harness();
  for (const item of equipment) h.values.set(local(`${item.key}_REQUESTED`), 1);
  await h.tick();
  await h.tick();
  for (const item of equipment) h.setPowered(item, true);
  await h.tick();
  h.state.groups = seats(false, true);
  h.refreshSeats();
  await h.tick();
  for (const item of equipment) {
    assert.equal(h.values.get(named('CIRCUIT SWITCH ON', item.circuit)), 0);
    assert.equal(h.values.get(local(`${item.key}_POWERED`)), 0);
    assert.equal(h.values.get(local(`${item.key}_REQUESTED`)), 1);
  }
});

test('main-generator failure inhibits battery/standby-only power; GPU permits restoration', async () => {
  const h = harness();
  for (const item of equipment) h.values.set(local(`${item.key}_REQUESTED`), 1);
  await h.tick();
  await h.tick();
  for (const item of equipment) h.setPowered(item, true);
  h.values.set(named('ELECTRICAL GENERATOR ACTIVE', 'StarterGenerator'), 0);
  await h.tick();
  for (const item of equipment) {
    assert.equal(h.values.get(named('CIRCUIT SWITCH ON', item.circuit)), 0);
    assert.equal(h.values.get(local(`${item.key}_STATUS`)), Status.SourceMissing);
  }
  for (const variable of ['EXTERNAL POWER AVAILABLE', 'EXTERNAL POWER ON', 'EXTERNAL POWER CONNECTION ON']) {
    h.values.set(named(variable, 'ExternalPower'), 1);
  }
  h.values.set(named('ELECTRICAL EXTERNAL POWER VOLTAGE', 'ExternalPower'), 28);
  await h.tick();
  for (const item of equipment) assert.equal(h.values.get(named('CIRCUIT SWITCH ON', item.circuit)), 1);
  h.values.set(named('EXTERNAL POWER CONNECTION ON', 'ExternalPower'), 0);
  await h.tick();
  for (const item of equipment) assert.equal(h.values.get(named('CIRCUIT SWITCH ON', item.circuit)), 0);
});

test('loss of bus voltage disables native loads and restoration preserves ON requests', async () => {
  const h = harness();
  h.values.set(local('LIDAR_REQUESTED'), 1);
  await h.tick();
  await h.tick();
  h.values.set(named('ELECTRICAL BUS VOLTAGE', 'Scientific_Equipment_Bus'), 19.9);
  await h.tick();
  assert.equal(h.values.get(named('CIRCUIT SWITCH ON', 'Scientific_LiDAR')), 0);
  assert.equal(h.values.get(local('LIDAR_POWERED')), 0);
  assert.equal(h.values.get(local('LIDAR_REQUESTED')), 1);
  h.values.set(named('ELECTRICAL BUS VOLTAGE', 'Scientific_Equipment_Bus'), 28);
  await h.tick();
  assert.equal(h.values.get(named('CIRCUIT SWITCH ON', 'Scientific_LiDAR')), 1);
});

test('feed and branch breaker readback prevents powered indication without resetting protection', async () => {
  const h = harness();
  for (const item of equipment) h.values.set(local(`${item.key}_REQUESTED`), 1);
  await h.tick();
  await h.tick();
  for (const item of equipment) h.setPowered(item, true);
  h.values.set(named('LINE BREAKER PULLED', 'Scientific_LiDAR_Line'), 1);
  await h.tick();
  assert.equal(h.values.get(local('LIDAR_STATUS')), Status.BreakerOpen);
  assert.equal(h.values.get(local('CAMERA_POWERED')), 1);
  h.values.set(named('LINE BREAKER PULLED', 'Scientific_Feed'), 1);
  await h.tick();
  assert.equal(h.values.get(local('CAMERA_STATUS')), Status.BreakerOpen);
  assert.equal(h.writes.some(write => /BREAKER|CONNECTION/.test(write.name)), false);
});

test('failed or stale crew queries inhibit loads and surface errors', async () => {
  const h = harness();
  h.values.set(local('LIDAR_REQUESTED'), 1);
  await h.tick();
  await h.tick();
  h.state.rejectSeats = true;
  h.refreshSeats();
  await h.tick();
  await h.tick();
  assert.equal(h.values.get(named('CIRCUIT SWITCH ON', 'Scientific_LiDAR')), 0);
  assert.equal(h.values.get(local('LIDAR_STATUS')), Status.CrewUnknown);
  assert.ok(h.errors.some(message => message.includes('Crew listener failed')));
  h.state.rejectSeats = false;
  await h.tick(500);
  await h.tick();
  assert.equal(h.values.get(named('CIRCUIT SWITCH ON', 'Scientific_LiDAR')), 1);
  h.state.stallSeats = true;
  await h.tick(1600);
  assert.equal(h.values.get(named('CIRCUIT SWITCH ON', 'Scientific_LiDAR')), 0);
});

test('invalid native readback fails closed for both circuits and reports the error', async () => {
  const h = harness();
  for (const item of equipment) h.values.set(local(`${item.key}_REQUESTED`), 1);
  await h.tick();
  await h.tick();
  h.state.invalidRead = named('ELECTRICAL CIRCUIT VOLTAGE', 'Scientific_LiDAR');
  await h.tick();
  for (const item of equipment) {
    assert.equal(h.values.get(named('CIRCUIT SWITCH ON', item.circuit)), 0);
    assert.equal(h.values.get(local(`${item.key}_POWERED`)), 0);
    assert.equal(h.values.get(local(`${item.key}_STATUS`)), Status.ControllerError);
  }
  assert.ok(h.errors.some(message => message.includes('Invalid SimVar read')));
});
