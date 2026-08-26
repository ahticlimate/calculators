/**
 * Server-side EUA quote.
 *
 * The browser cannot fetch this itself: the upstream sends no CORS headers, and
 * the previous source (stooq) now answers every quote request with a 404 and a
 * JavaScript proof-of-work challenge. Fetching here sidesteps both, keeps the
 * upstream swappable without touching the client, and lets the answer be cached.
 *
 * CO2.L is the SparkChange Physical Carbon EUA ETC, quoted in EUR and backed by
 * held EUAs. It tracks the allowance price closely but is not the ICE
 * front-month settlement, so it is presented on the page as indicative.
 */
const SOURCES = [
  "https://query1.finance.yahoo.com/v8/finance/chart/CO2.L?interval=1d&range=5d",
  "https://query2.finance.yahoo.com/v8/finance/chart/CO2.L?interval=1d&range=5d",
];

/*
 * An honest identifier, deliberately not a spoofed browser string: the upstream
 * answers 200 to this and 429 to a Chrome User-Agent coming from a server.
 */
const UA = "ahti-surplus-calculator/1.0 (+https://ahticlimate.com)";

const fail = (reason) =>
  new Response(JSON.stringify({ error: reason }), {
    status: 502,
    headers: { "Content-Type": "application/json" },
  });

const headers = { "User-Agent": UA, Accept: "application/json" };

export default async () => {
  let meta;
  let lastError = "upstream unreachable";

  // The two hosts are interchangeable and rate-limit independently.
  for (const source of SOURCES) {
    try {
      const response = await fetch(source, { headers });
      if (!response.ok) {
        lastError = `upstream ${response.status}`;
        continue;
      }
      const payload = await response.json();
      meta = payload?.chart?.result?.[0]?.meta;
      if (meta) break;
      lastError = "no data in response";
    } catch {
      lastError = "upstream unreachable";
    }
  }

  if (!meta) return fail(lastError);

  const price = meta?.regularMarketPrice;
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return fail("no price in response");
  }

  /*
   * London-listed instruments are frequently quoted in pence. Taking such a
   * figure as euros would understate the ETS cost by two orders of magnitude
   * without anything looking obviously wrong, so anything but EUR is refused.
   */
  if (meta.currency !== "EUR") {
    return fail(`unexpected currency ${meta.currency}`);
  }

  return new Response(
    JSON.stringify({
      price,
      currency: meta.currency,
      asOf: new Date(meta.regularMarketTime * 1000).toISOString().slice(0, 10),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=900",
      },
    },
  );
};

export const config = { path: "/api/eua" };
