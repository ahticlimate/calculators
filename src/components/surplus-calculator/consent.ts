const KEY = "ahti-surplus-calculator/consent";

export type ConsentState = "unset" | "granted" | "denied";

/**
 * Consent to record the figures typed into the calculator. Asked once on
 * arrival and remembered. Declining changes nothing about how the tool works —
 * that is what keeps the consent freely given rather than a toll gate.
 */
export const loadConsent = (): ConsentState => {
  try {
    const stored = window.localStorage.getItem(KEY);
    return stored === "granted" || stored === "denied" ? stored : "unset";
  } catch {
    return "unset";
  }
};

export const saveConsent = (state: ConsentState): void => {
  try {
    window.localStorage.setItem(KEY, state);
  } catch {
    // A viewer with site data blocked simply gets asked again next visit.
  }
};
