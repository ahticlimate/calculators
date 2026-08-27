import type { ReactNode, RefObject } from "react";
import styled from "styled-components";
import { theme } from "../../theme";

const Banner = styled.section<{ $tone: "primary" | "secondary" }>`
  background: ${(p) =>
    p.$tone === "primary"
      ? `linear-gradient(135deg, ${theme.colors.lightBlue} 0%, ${theme.colors.darkBlue} 100%)`
      : `linear-gradient(135deg, ${theme.colors.green} 0%, ${theme.colors.darkestGreen} 100%)`};
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
    font-size: 16px; /* keeps iOS from zooming the page on focus */
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

const SendButton = styled.button<{ $tone: "primary" | "secondary" }>`
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  flex: 0 0 auto;
  border: 0;
  border-radius: 4px;
  background: ${(p) =>
    p.$tone === "primary" ? theme.colors.green : theme.colors.white};
  color: ${(p) =>
    p.$tone === "primary" ? theme.colors.darkestGreen : theme.colors.darkGreen};
  ${theme.fontLabelBold};
  font-size: 16px;
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  cursor: pointer;

  &:hover {
    background: ${(p) =>
      p.$tone === "primary" ? theme.colors.lightGreen : theme.colors.grey(5)};
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

export interface BannerContact {
  email: string;
  phone: string;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

interface RequestBannerProps {
  tone?: "primary" | "secondary";
  eyebrow: string;
  headline: ReactNode;
  body: string;
  buttonLabel: string;
  /** Blocks a second submit and reports the outcome in the button label. */
  submitState?: "idle" | "sending" | "sent" | "error";
  contact: BannerContact;
  note: { text: string; warn: boolean };
  defaultNote: string;
  sectionRef?: RefObject<HTMLElement | null>;
  emailRef?: RefObject<HTMLInputElement | null>;
  /** An extra input rendered before the send button, e.g. a vessel IMO. */
  extraField?: ReactNode;
  onSend: () => void;
}

/** Shared shell for the request-a-price banners. */
export const RequestBanner = ({
  tone = "primary",
  eyebrow,
  headline,
  body,
  buttonLabel,
  submitState = "idle",
  contact,
  note,
  defaultNote,
  sectionRef,
  emailRef,
  extraField,
  onSend,
}: RequestBannerProps) => (
  <Banner ref={sectionRef} $tone={tone}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <Headline>{headline}</Headline>
    <Body>{body}</Body>
    <Row>
      <InputWrap>
        <input
          ref={emailRef}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          aria-label="Email"
          value={contact.email}
          onChange={(e) => contact.onEmailChange(e.target.value)}
        />
      </InputWrap>
      <InputWrap>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Phone (optional)"
          aria-label="Phone"
          value={contact.phone}
          onChange={(e) => contact.onPhoneChange(e.target.value)}
        />
      </InputWrap>
      {extraField}
      <SendButton
        type="button"
        $tone={tone}
        disabled={submitState === "sending" || submitState === "sent"}
        onClick={onSend}
      >
        {submitState === "sending"
          ? "Sending…"
          : submitState === "sent"
            ? "Sent"
            : buttonLabel}
      </SendButton>
    </Row>
    <Note $warn={note.warn} aria-live="polite">
      {note.text || defaultNote}
    </Note>
  </Banner>
);

export { InputWrap as BannerInputWrap };
