export const equipment = [
  { key: 'LIDAR', circuit: 'Scientific_LiDAR', line: 'Scientific_LiDAR_Line', label: 'LiDAR', watts: 550 },
  { key: 'CAMERA', circuit: 'Scientific_Camera', line: 'Scientific_Camera_Line', label: 'Camera', watts: 400 }
] as const;

export type Equipment = typeof equipment[number];
export const local = (key: string): string => `L:C208_SCI_${key}`;
export const named = (variable: string, component: string): string => `${variable}:'${component}'_n`;

export interface SeatSection {
  name: string;
  occupation: number;
  configured_occupation: number;
  current_mass: number;
  seats: { is_occupied: boolean }[];
}

export interface SeatGroup {
  name: string;
  sections: SeatSection[];
}

export function specialistAPresent(groups: SeatGroup[]): boolean {
  const sections = groups.reduce<SeatSection[]>((all, group) => all.concat(group.sections), [])
    .filter(section => section.name === 'TT:MENU.PAYLOAD.PASSENGER_03');
  if (sections.length !== 1) {
    throw new Error(`Expected one Specialist A payload section (PASSENGER_03); found ${sections.length}`);
  }
  const section = sections[0]!;
  if (!Number.isFinite(section.occupation) || !Number.isFinite(section.current_mass)) {
    throw new Error('Invalid Specialist A occupancy data');
  }
  // Use live occupation, not configured occupation or a legacy payload-station index.
  return section.occupation > 0 && section.current_mass > 0;
}

export interface Inputs {
  requested: boolean;
  crewKnown: boolean;
  crewPresent: boolean;
  sourceAvailable: boolean;
  busVoltage: number;
  feedOpen: boolean;
  branchOpen: boolean;
  voltage: number;
  circuitOn: boolean;
  amps: number;
}

export const Status = {
  Off: 0,
  Powered: 1,
  CrewUnknown: 2,
  CrewMissing: 3,
  SourceMissing: 4,
  BreakerOpen: 5,
  NoPower: 6,
  ControllerError: 8
} as const;
export type Status = typeof Status[keyof typeof Status];

export const messages: Record<Status, string> = {
  [Status.Off]: 'OFF',
  [Status.Powered]: 'POWERED',
  [Status.CrewUnknown]: 'Crew data unavailable - operation inhibited',
  [Status.CrewMissing]: 'Specialist A required at the operator console',
  [Status.SourceMissing]: 'Main generator or external ground power required',
  [Status.BreakerOpen]: 'Scientific feed or equipment breaker open',
  [Status.NoPower]: 'No equipment power - check voltage and connections',
  [Status.ControllerError]: 'Aircraft controller error - check simulator console'
};

export function evaluate(input: Inputs): { enable: boolean; powered: boolean; status: Status } {
  const enable = input.requested && input.crewKnown && input.crewPresent && input.sourceAvailable
    && input.busVoltage >= 20 && input.busVoltage <= 32;
  let status: Status;
  if (!input.requested) status = Status.Off;
  else if (!input.crewKnown) status = Status.CrewUnknown;
  else if (!input.crewPresent) status = Status.CrewMissing;
  else if (!input.sourceAvailable) status = Status.SourceMissing;
  else if (input.feedOpen || input.branchOpen) status = Status.BreakerOpen;
  else if (!enable || !input.circuitOn || input.voltage < 20 || input.voltage > 32 || input.amps <= 0) status = Status.NoPower;
  else status = Status.Powered;
  return { enable, powered: status === Status.Powered, status };
}
