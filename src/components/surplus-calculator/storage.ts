import {
  DEFAULT_FOSSIL,
  DEFAULT_RAW_INPUTS,
  type FossilFuelKey,
  type RawInputs,
} from "./model";

const KEY = "ahti-surplus-calculator/inputs";

/**
 * The live quotes are refetched on every visit, so persisting them would only
 * fight the refresh. Everything the operator types by hand is worth keeping.
 */
type Persisted = Omit<RawInputs, "eua" | "fx"> & { fossil: FossilFuelKey };

export interface StoredInputs {
  fossil: FossilFuelKey;
  raw: RawInputs;
}

/**
 * Kept in the viewer's own browser and never sent anywhere. It exists so a
 * returning user does not retype their prices, which is the slowest part of
 * the form on a phone.
 */
export const loadInputs = (): StoredInputs => {
  const fallback: StoredInputs = {
    fossil: DEFAULT_FOSSIL,
    raw: DEFAULT_RAW_INPUTS,
  };

  try {
    const stored = window.localStorage.getItem(KEY);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored) as Partial<Persisted>;
    const pick = (field: keyof Persisted) =>
      typeof parsed[field] === "string" ? (parsed[field] as string) : undefined;

    return {
      fossil:
        parsed.fossil === "hfo" ||
        parsed.fossil === "lfo" ||
        parsed.fossil === "mgo"
          ? parsed.fossil
          : DEFAULT_FOSSIL,
      raw: {
        ...DEFAULT_RAW_INPUTS,
        tons: pick("tons") ?? DEFAULT_RAW_INPUTS.tons,
        ciBio: pick("ciBio") ?? DEFAULT_RAW_INPUTS.ciBio,
        priceFossil: pick("priceFossil") ?? DEFAULT_RAW_INPUTS.priceFossil,
        priceBio: pick("priceBio") ?? DEFAULT_RAW_INPUTS.priceBio,
        poolPriceEur: pick("poolPriceEur") ?? DEFAULT_RAW_INPUTS.poolPriceEur,
      },
    };
  } catch {
    // Private windows and blocked site data throw on access rather than
    // returning null, so the defaults have to survive that.
    return fallback;
  }
};

export const saveInputs = (fossil: FossilFuelKey, raw: RawInputs): void => {
  try {
    const { eua: _eua, fx: _fx, ...rest } = raw;
    window.localStorage.setItem(KEY, JSON.stringify({ fossil, ...rest }));
  } catch {
    // Nothing to do — persistence is a convenience, not a requirement.
  }
};
