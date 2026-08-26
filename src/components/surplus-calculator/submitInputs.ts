import type { CalculatorInputs, CalculatorResult } from "./model";

/**
 * Netlify Forms matches a urlencoded POST to a form by its `form-name` field.
 * The form is declared in public/__forms.html: Netlify discovers forms by
 * parsing deployed HTML at build time and never sees what React renders, and
 * posting to a real file keeps the single-page-app catch-all rewrite in
 * netlify.toml from swallowing the request.
 *
 * Figures only — no email, phone or IMO. Those reach Ahti solely through the
 * enquiry mails the operator composes and sends themselves.
 */
export const FORM_NAME = "calculator-inputs";

export const submitInputs = async (
  inputs: CalculatorInputs,
  result: CalculatorResult,
): Promise<boolean> => {
  const body = new URLSearchParams({
    "form-name": FORM_NAME,
    "bot-field": "",
    fossil: result.fuel.name,
    tons: String(inputs.tons),
    ciBio: String(inputs.ciBio),
    priceFossil: String(inputs.priceFossil),
    priceBio: String(inputs.priceBio),
    poolPriceEur: String(inputs.poolPriceEur),
    eua: String(inputs.eua),
    fx: String(inputs.fx),
    surplus: result.surplus.toFixed(1),
    poolNet: result.poolNet.toFixed(0),
    offsetNet: result.offsetNet.toFixed(0),
  });

  try {
    const response = await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    return response.ok;
  } catch {
    // Recording is best-effort; a failure must never block the calculation.
    return false;
  }
};
