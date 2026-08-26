import type { RefObject } from "react";
import { CONTACT_EMAIL } from "./model";
import { formatInt } from "./format";
import { RequestBanner, type BannerContact } from "./RequestBanner";

/** No surplus means there is nothing to price, so the ask changes to a scope check. */
const pitch = (surplus: number) =>
  surplus > 0
    ? {
        eyebrow: "Ready to sell",
        headline: (
          <>
            <span>{formatInt(surplus)} tCO₂e</span> of compliance surplus. What
            is it worth?
          </>
        ),
        body: "Ahti buys verified FuelEU units directly and settles the pooling for you. Leave an email or a phone number and we come back with a firm price. Your figures above go with the request, so there is nothing else to fill in.",
      }
    : {
        eyebrow: "Let us check the scope",
        headline: <>No surplus at these inputs. Have we got that right?</>,
        body: "A surplus only arises on energy inside the FuelEU scope, and the certified intensity of the fuel decides how much. Send us your trade pattern and the Proof of Sustainability and we will run the real numbers.",
      };

interface QuoteRequestCtaProps {
  surplus: number;
  contact: BannerContact;
  note: { text: string; warn: boolean };
  sectionRef: RefObject<HTMLElement | null>;
  emailRef: RefObject<HTMLInputElement | null>;
  onSend: () => void;
}

export const QuoteRequestCta = ({
  surplus,
  contact,
  note,
  sectionRef,
  emailRef,
  onSend,
}: QuoteRequestCtaProps) => {
  const copy = pitch(surplus);

  return (
    <RequestBanner
      tone="primary"
      eyebrow={copy.eyebrow}
      headline={copy.headline}
      body={copy.body}
      buttonLabel="Get a price"
      contact={contact}
      note={note}
      defaultNote={`Goes to ${CONTACT_EMAIL}. We reply within one business day.`}
      sectionRef={sectionRef}
      emailRef={emailRef}
      onSend={onSend}
    />
  );
};
