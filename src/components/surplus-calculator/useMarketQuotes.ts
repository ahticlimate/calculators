import { useCallback, useEffect, useRef, useState } from "react";

const EUA_SRC = "https://stooq.com/q/l/?s=ck.f&f=sd2t2ohlc&h&e=csv";
const PROXY = "https://api.allorigins.win/raw?url=";
const FX_SRC = [
  "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD",
  "https://open.er-api.com/v6/latest/EUR",
];

/** Status of a single quote, tracked per source so each field can say which it is. */
export type SourceState = "checking" | "live" | "stale";

export interface QuoteStatus {
  eua: SourceState;
  fx: SourceState;
}

const CHECKING: QuoteStatus = { eua: "checking", fx: "checking" };

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
  const [status, setStatus] = useState<QuoteStatus>(CHECKING);
  const onQuotesRef = useRef(onQuotes);

  useEffect(() => {
    onQuotesRef.current = onQuotes;
  });

  const run = useCallback(() => {
    void loadEua().then(
      (price) => {
        onQuotesRef.current({ eua: price });
        setStatus((prev) => ({ ...prev, eua: "live" }));
      },
      () => setStatus((prev) => ({ ...prev, eua: "stale" })),
    );

    void loadFx().then(
      (rate) => {
        onQuotesRef.current({ fx: Math.round(rate * 10000) / 10000 });
        setStatus((prev) => ({ ...prev, fx: "live" }));
      },
      () => setStatus((prev) => ({ ...prev, fx: "stale" })),
    );
  }, []);

  // The first look-up runs on mount; "checking" is already the initial state.
  useEffect(() => {
    run();
  }, [run]);

  const refresh = useCallback(() => {
    setStatus(CHECKING);
    run();
  }, [run]);

  return { status, refresh };
};
