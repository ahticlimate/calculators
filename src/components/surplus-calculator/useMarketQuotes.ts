import { useCallback, useEffect, useRef, useState } from "react";

const EUA_SRC = "https://stooq.com/q/l/?s=ck.f&f=sd2t2ohlc&h&e=csv";
const PROXY = "https://api.allorigins.win/raw?url=";
const FX_SRC = [
  "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD",
  "https://open.er-api.com/v6/latest/EUR",
];

export type QuoteState = "checking" | "live" | "partial" | "stale";

export interface MarketQuotes {
  eua?: number;
  fx?: number;
}

const getText = async (url: string): Promise<string> => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(String(response.status));
  return response.text();
};

const parseEua = (text: string): number => {
  const rows = text.trim().split("\n");
  if (rows.length < 2) throw new Error("empty");
  const price = parseFloat(rows[1].split(",")[6]);
  if (!isFinite(price) || price <= 0) throw new Error("bad");
  return price;
};

const loadEua = async (): Promise<number> => {
  try {
    return parseEua(await getText(EUA_SRC));
  } catch {
    return parseEua(await getText(PROXY + encodeURIComponent(EUA_SRC)));
  }
};

const pickUsd = (text: string): number => {
  const rate = JSON.parse(text).rates?.USD;
  if (!isFinite(rate)) throw new Error("bad");
  return rate;
};

const loadFx = async (): Promise<number> => {
  try {
    return pickUsd(await getText(FX_SRC[0]));
  } catch {
    return pickUsd(await getText(FX_SRC[1]));
  }
};

/**
 * Pulls an indicative front-month EUA quote and the EUR/USD reference rate.
 * Whatever fails simply keeps the fallback figure already in the form.
 */
export const useMarketQuotes = (onQuotes: (quotes: MarketQuotes) => void) => {
  const [state, setState] = useState<QuoteState>("checking");
  const onQuotesRef = useRef(onQuotes);

  useEffect(() => {
    onQuotesRef.current = onQuotes;
  });

  const run = useCallback(() => {
    const eua = loadEua().then(
      (price) => {
        onQuotesRef.current({ eua: price });
        return true;
      },
      () => false,
    );

    const fx = loadFx().then(
      (rate) => {
        onQuotesRef.current({ fx: Math.round(rate * 10000) / 10000 });
        return true;
      },
      () => false,
    );

    void Promise.all([eua, fx]).then(([euaOk, fxOk]) => {
      if (euaOk && fxOk) setState("live");
      else if (euaOk || fxOk) setState("partial");
      else setState("stale");
    });
  }, []);

  // The first look-up runs on mount; "checking" is already the initial state.
  useEffect(() => {
    run();
  }, [run]);

  const refresh = useCallback(() => {
    setState("checking");
    run();
  }, [run]);

  return { state, refresh };
};
