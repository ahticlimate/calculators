/**
 * FuelEU Maritime surplus model.
 *
 * Compliance balance follows FuelEU Maritime Annex IV:
 * (target intensity − biofuel intensity) × energy delivered in scope, converted to tCO2e.
 */

export const TARGET_INTENSITY = 89.3368; // FuelEU 2026 target, gCO2e/MJ
export const BIOFUEL_LCV = 37; // biofuel energy content, MJ/kg
export const FALLBACK_QUOTE_DATE = "18 Aug 2026";
export const FALLBACK_FX = 1.1573;
export const CONTACT_EMAIL = "info@ahticlimate.com";

/**
 * Assumed cost of a FuelEU compliance deficit, EUR per tCO2e. The surplus is
 * valued at this rate throughout: every tonne generated is a tonne of penalty
 * that does not have to be paid.
 */
export const PENALTY_EUR_PER_TONNE = 640;

/** Default price paid for surplus units in a pool, EUR per tCO2e. */
export const DEFAULT_POOL_PRICE_EUR = 80;

export type FossilFuelKey = "hfo" | "lfo" | "mgo";

export interface FossilFuel {
  key: FossilFuelKey;
  name: string;
  /** Well-to-wake intensity, gCO2e/MJ (FuelEU Annex II) */
  ci: number;
  /** CO2 emission factor, tCO2 per tonne of fuel */
  ef: number;
  /** Typical delivered price, USD per tonne */
  price: number;
}

export const FOSSIL_FUELS: Record<FossilFuelKey, FossilFuel> = {
  hfo: { key: "hfo", name: "HFO / VLSFO", ci: 91.7, ef: 3.114, price: 520 },
  lfo: { key: "lfo", name: "LFO", ci: 91.4, ef: 3.151, price: 620 },
  mgo: { key: "mgo", name: "MDO / MGO", ci: 90.77, ef: 3.206, price: 720 },
};

export const FOSSIL_FUEL_ORDER: FossilFuelKey[] = ["hfo", "lfo", "mgo"];

export interface CalculatorInputs {
  fossil: FossilFuelKey;
  /** Tonnes of fossil fuel replaced */
  tons: number;
  /** Certified well-to-wake intensity of the biofuel, gCO2e/MJ */
  ciBio: number;
  /** Fossil fuel price, USD per tonne */
  priceFossil: number;
  /** Biofuel price, USD per tonne */
  priceBio: number;
  /** EUA price, EUR per tCO2 */
  eua: number;
  /** Price paid for surplus units in a pool, EUR per tCO2e */
  poolPriceEur: number;
  /** EUR / USD rate */
  fx: number;
}

export interface CalculatorResult {
  tons: number;
  fx: number;
  fuel: FossilFuel;
  /** Compliance surplus generated, tCO2e */
  surplus: number;
  /** Penalty rate applied, USD per tCO2e */
  penaltyRate: number;
  /** FuelEU penalty avoided if the surplus offsets your own deficit, USD */
  penaltyAvoided: number;
  /** Pooled unit price applied, USD per tCO2e */
  poolRate: number;
  /** Profit from pooling the surplus instead, USD */
  poolProfit: number;
  /** EU ETS cost avoided, USD — earned either way */
  ets: number;
  /** Biofuel premium paid, USD */
  premium: number;

  /**
   * The surplus is worth either the penalty it offsets or the price a pool pays
   * for it, never both, so the two routes carry their own totals rather than
   * being summed into one.
   */
  offsetValue: number;
  offsetNet: number;
  poolValue: number;
  poolNet: number;
}

/**
 * The numeric fields are held as raw strings while the user types, so a
 * half-finished "1." or a briefly empty box does not fight the caret.
 */
export type NumericField = keyof Omit<CalculatorInputs, "fossil">;

export type RawInputs = Record<NumericField, string>;

export const DEFAULT_FOSSIL: FossilFuelKey = "mgo";

export const DEFAULT_RAW_INPUTS: RawInputs = {
  tons: "1000",
  ciBio: "15",
  priceFossil: String(FOSSIL_FUELS[DEFAULT_FOSSIL].price),
  priceBio: "1275",
  eua: "81.35",
  poolPriceEur: String(DEFAULT_POOL_PRICE_EUR),
  fx: String(FALLBACK_FX),
};

export const toNumber = (value: string): number => {
  const parsed = parseFloat(value);
  return isFinite(parsed) ? parsed : 0;
};

export const toInputs = (
  fossil: FossilFuelKey,
  raw: RawInputs,
): CalculatorInputs => ({
  fossil,
  tons: toNumber(raw.tons),
  ciBio: toNumber(raw.ciBio),
  priceFossil: toNumber(raw.priceFossil),
  priceBio: toNumber(raw.priceBio),
  eua: toNumber(raw.eua),
  poolPriceEur: toNumber(raw.poolPriceEur),
  fx: toNumber(raw.fx),
});

/** Runs the model, optionally overriding the biofuel intensity (used by the sensitivity strip). */
export const calculate = (
  inputs: CalculatorInputs,
  ciBioOverride?: number,
): CalculatorResult => {
  const ciBio = ciBioOverride ?? inputs.ciBio;
  const fuel = FOSSIL_FUELS[inputs.fossil] ?? FOSSIL_FUELS.mgo;
  const fx = inputs.fx || FALLBACK_FX;
  const megajoules = inputs.tons * BIOFUEL_LCV * 1000;

  // tCO2e, all energy assumed to be in scope
  const surplus = ((TARGET_INTENSITY - ciBio) * megajoules) / 1e6;

  const penaltyRate = PENALTY_EUR_PER_TONNE * fx;
  const poolRate = inputs.poolPriceEur * fx;
  const available = Math.max(surplus, 0);

  const penaltyAvoided = available * penaltyRate;
  const poolProfit = available * poolRate;
  const ets = inputs.tons * fuel.ef * inputs.eua * fx;
  const premium = inputs.tons * (inputs.priceBio - inputs.priceFossil);

  const offsetValue = penaltyAvoided + ets;
  const poolValue = poolProfit + ets;

  return {
    tons: inputs.tons,
    fx,
    fuel,
    surplus,
    penaltyRate,
    penaltyAvoided,
    poolRate,
    poolProfit,
    ets,
    premium,
    offsetValue,
    offsetNet: offsetValue - premium,
    poolValue,
    poolNet: poolValue - premium,
  };
};

export const SENSITIVITY_INTENSITIES = [5, 10, 15, 20, 30];
