/** Vehicle master table record */
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  chassis: string;
  year: string;
  engine: string;
  power: string;
  area: string[];
}

/** Product compatibility record (for 4S, IBOOST2, Valve) */
export interface ProductVehicle {
  brand: string;
  model: string;
  chassis: string;
  year: string;
  engine: string;
  harness?: string;
  area?: string;
  // FD-EVO specific
  oilTemp?: string;
  transTemp?: string;
  basicInfo?: string;
  fuel?: string;
  // D-Meter 2Plus specific
  coolant?: string;
  boost?: string;
  egt?: string;
  intakeTemp?: string;
  voltage?: string;
  speed?: string;
  rpm?: string;
  mileage?: string;
  afr?: string;
  compatibility?: string;
  version?: string;
}

/** ST-Filter record (from JSON, not Notion) */
export interface STFilterVehicle {
  brand: string;
  model: string;
  chassis: string;
  year: string;
  engine: string;
  knNumber: string;
  swCode: string | null;
  inStock: boolean;
  outsideLength: number | null;
  outsideWidth: number | null;
  height: number | null;
  weight: number | null;
}
