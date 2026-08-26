import { CONTACT_EMAIL } from "./model";
import { formatInt } from "./format";
import { RequestBanner, BannerInputWrap, type BannerContact } from "./RequestBanner";

interface BiofuelOfferCtaProps {
  tons: number;
  imo: string;
  onImoChange: (value: string) => void;
  contact: BannerContact;
  note: { text: string; warn: boolean };
  onSend: () => void;
}

/**
 * The other side of the same switch: the operator still has to buy the biofuel
 * the calculation assumes. The vessel IMO is optional but lets us check the
 * FuelEU scope and bunkering ports before quoting.
 */
export const BiofuelOfferCta = ({
  tons,
  imo,
  onImoChange,
  contact,
  note,
  onSend,
}: BiofuelOfferCtaProps) => (
  <RequestBanner
    tone="secondary"
    eyebrow="Still need the fuel"
    headline={
      tons > 0 ? (
        <>
          Want an offer on the <span>{formatInt(tons)} t</span> of biofuel this
          assumes?
        </>
      ) : (
        <>Want an offer on the biofuel itself?</>
      )
    }
    body="The figures above assume you can buy certified biofuel at the price you entered. Ahti sources it with the Proof of Sustainability attached, so the intensity you are counting on is the intensity you get. Add your vessel IMO and we can check the FuelEU scope and bunkering ports before quoting."
    buttonLabel="Request an offer"
    contact={contact}
    note={note}
    defaultNote={`Goes to ${CONTACT_EMAIL}. We reply within one business day.`}
    extraField={
      <BannerInputWrap>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Vessel IMO (optional)"
          aria-label="Vessel IMO number"
          maxLength={10}
          value={imo}
          onChange={(e) => onImoChange(e.target.value)}
        />
      </BannerInputWrap>
    }
    onSend={onSend}
  />
);
