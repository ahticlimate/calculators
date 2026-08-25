import type { RefObject } from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import { CONTACT_EMAIL } from "./model";
import { formatInt } from "./format";

const Cta = styled.section`
  background: linear-gradient(
    135deg,
    ${theme.colors.lightBlue} 0%,
    ${theme.colors.darkBlue} 100%
  );
  border-radius: 4px;
  padding: ${theme.spacing(4)} ${theme.spacing(4)};
  margin-bottom: ${theme.spacing(4)};
  color: ${theme.colors.white};
`;

const Eyebrow = styled.p`
  margin: 0;
  ${theme.fontLabelBold};
  ${theme.fontSize(-2)};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
`;

const Headline = styled.h3`
  margin: 6px 0;
  ${theme.fontTitle};
  ${theme.fontSize(2)};
  letter-spacing: -0.01em;
  line-height: 1.15;
  color: ${theme.colors.white};

  span {
    color: ${theme.colors.lightGreen};
  }
`;

const Body = styled.p`
  margin: 0 0 ${theme.spacing(3)};
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.6;
  max-width: 520px;
`;

const Row = styled.div`
  display: flex;
  gap: ${theme.spacing(2)};
  flex-wrap: wrap;
`;

const InputWrap = styled.div`
  flex: 1 1 190px;
  min-width: 0;

  input {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.12);
    padding: ${theme.spacing(2)} ${theme.spacing(2)};
    color: ${theme.colors.white};
    ${theme.fontNormal};
    ${theme.fontSize(-1)};
    outline: 0;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.65);
  }

  input:focus {
    border-color: ${theme.colors.white};
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SendButton = styled.button`
  flex: 0 0 auto;
  border: 0;
  border-radius: 4px;
  background: ${theme.colors.green};
  color: ${theme.colors.darkestGreen};
  ${theme.fontLabelBold};
  ${theme.fontSize(-1)};
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  cursor: pointer;

  &:hover {
    background: ${theme.colors.lightGreen};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.white};
    outline-offset: 2px;
  }
`;

const Note = styled.p<{ $warn?: boolean }>`
  margin: ${theme.spacing(2)} 0 0;
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${(p) => (p.$warn ? "#FFD9A8" : "rgba(255, 255, 255, 0.75)")};
`;

interface QuoteRequestCtaProps {
  surplus: number;
  email: string;
  phone: string;
  note: { text: string; warn: boolean };
  sectionRef: RefObject<HTMLElement | null>;
  emailRef: RefObject<HTMLInputElement | null>;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSend: () => void;
}

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

export const QuoteRequestCta = ({
  surplus,
  email,
  phone,
  note,
  sectionRef,
  emailRef,
  onEmailChange,
  onPhoneChange,
  onSend,
}: QuoteRequestCtaProps) => {
  const copy = pitch(surplus);

  return (
    <Cta ref={sectionRef}>
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <Headline>{copy.headline}</Headline>
      <Body>{copy.body}</Body>
      <Row>
        <InputWrap>
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </InputWrap>
        <InputWrap>
          <input
            type="tel"
            placeholder="Phone (optional)"
            aria-label="Phone"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
        </InputWrap>
        <SendButton type="button" onClick={onSend}>
          Get a price
        </SendButton>
      </Row>
      <Note $warn={note.warn} aria-live="polite">
        {note.text ||
          `Goes to ${CONTACT_EMAIL}. We reply within one business day.`}
      </Note>
    </Cta>
  );
};
