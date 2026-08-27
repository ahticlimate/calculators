const n0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const n1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const n2 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const n4 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 });

/** Thin spaces instead of commas, the way the printed figures read. */
const spaced = (value: string): string => value.replace(/,/g, " ");

export const formatInt = (value: number): string => spaced(n0.format(value));
export const formatOne = (value: number): string => spaced(n1.format(value));
export const formatTwo = (value: number): string => spaced(n2.format(value));

/** FX needs its full precision on a printed record, or the figures cannot be reproduced. */
export const formatRate = (value: number): string => spaced(n4.format(value));

/** Plain integer, no thin spaces — for the email summary. */
export const plainInt = (value: number): string => n0.format(value);
export const plainOne = (value: number): string => n1.format(value);
export const plainTwo = (value: number): string => n2.format(value);

/** Signed ledger amount, e.g. "+254 657" or "−555 000". */
export const formatSigned = (value: number): string =>
  (value < 0 ? "−" : "+") + spaced(n0.format(Math.abs(value)));

/** Compact money, e.g. "$557k" or "−$1.24m". */
export const formatCompact = (value: number): string => {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−$" : "$";
  if (abs >= 1e6) return sign + n2.format(abs / 1e6) + "m";
  if (abs >= 1e4) return sign + n0.format(abs / 1e3) + "k";
  if (abs >= 1e3) return sign + n1.format(abs / 1e3) + "k";
  return sign + n0.format(abs);
};
