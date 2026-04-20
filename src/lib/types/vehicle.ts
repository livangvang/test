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

/** ST-Filter record (from Notion DB: st-filter auto ai) */
export interface STFilterVehicle {
  brand: string;
  model: string;
  chassis: string;
  year: string;
  engine: string;
  knNumber: string;         // ST-Filter column in Notion
  swCode: string | null;    // SW品號 column
  oemNumber: string;        // OEM料號 column
  shape: string;            // Shape: Panel / Round / Cone / Trapezoidal
  packageContents: string;  // Package_Contents column
  inStock: boolean;         // Defaults to true (not in Notion)
  outsideLength: string | null;  // Length (stored as text in Notion)
  outsideWidth: string | null;   // Width
  height: string | null;
  weight: string | null;
  notes: string | null;     // Notes column
}
