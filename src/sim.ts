export function read(name: string, unit = 'number'): number {
  const value: unknown = SimVar.GetSimVarValue(name, unit);
  if (typeof value === 'boolean') return Number(value);
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid SimVar read: ${name}`);
  }
  return value;
}

export async function write(name: string, value: number, unit = 'number'): Promise<void> {
  await SimVar.SetSimVarValue(name, unit, value);
}
