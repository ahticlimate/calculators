import type { CalculatorInputs, CalculatorResult } from "./model";

/**
 * Netlify Forms matches a urlencoded POST to a form by its `form-name` field.
 * Every form is declared as static markup in public/__forms.html: Netlify
 * discovers forms by parsing deployed HTML at build time and never sees what
 * React renders. Posting to that real file also keeps the single-page-app
 * catch-all rewrite in netlify.toml from swallowing the request.
 *
 * Any field posted here must exist in that declaration or it will not be kept.
 */
const ENDPOINT = "/__forms.html";

export const FORM_INPUTS = "calculator-inputs";
export const FORM_QUOTE = "quote-request";
export const FORM_BIOFUEL = "biofuel-offer";
export const FORM_FEEDBACK = "feedback";

export type SubmitState = "idle" | "sending" | "sent" | "error";

export const submitForm = async (
  formName: string,
  fields: Record<string, string>,
): Promise<boolean> => {
  const body = new URLSearchParams({
    "form-name": formName,
    "bot-field": "",
    ...fields,
  });

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    return response.ok;
  } catch {
    return false;
  }
};

/** The figures behind a calculation, shared by every enquiry so context travels with it. */
const figures = (inputs: CalculatorInputs, result: CalculatorResult) => ({
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

/**
 * Figures only — no contact details. This is the anonymous record kept when the
 * operator has allowed it, and it must stay separable from the enquiries below,
 * which carry personal data and are sent on the operator's own initiative.
 */
export const submitInputs = (
  inputs: CalculatorInputs,
  result: CalculatorResult,
): Promise<boolean> => submitForm(FORM_INPUTS, figures(inputs, result));

export const submitQuoteRequest = (
  inputs: CalculatorInputs,
  result: CalculatorResult,
  contact: { email: string; phone: string; topics: string[] },
): Promise<boolean> =>
  submitForm(FORM_QUOTE, {
    ...figures(inputs, result),
    email: contact.email,
    phone: contact.phone,
    topics: contact.topics.join(", "),
    ets: result.ets.toFixed(0),
    premium: result.premium.toFixed(0),
    poolProfit: result.poolProfit.toFixed(0),
    penaltyAvoided: result.penaltyAvoided.toFixed(0),
  });

export const submitBiofuelOffer = (
  inputs: CalculatorInputs,
  result: CalculatorResult,
  contact: { email: string; phone: string; imo: string },
): Promise<boolean> =>
  submitForm(FORM_BIOFUEL, {
    ...figures(inputs, result),
    email: contact.email,
    phone: contact.phone,
    imo: contact.imo,
  });

export const submitFeedback = (message: string, email: string) =>
  submitForm(FORM_FEEDBACK, { message, email });
