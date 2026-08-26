import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import { ATTENTION, ATTENTION_WASH, Columns } from "./calculator-styles";
import { Assumptions } from "./Assumptions";
import { HeadlineFigures } from "./HeadlineFigures";
import { InputsPanel, type HelpTopic } from "./InputsPanel";
import { LedgerPanel } from "./LedgerPanel";
import { QuoteRequestCta } from "./QuoteRequestCta";
import { BiofuelOfferCta } from "./BiofuelOfferCta";
import { SensitivityPanel } from "./SensitivityPanel";
import {
  CONTACT_EMAIL,
  FOSSIL_FUELS,
  calculate,
  toInputs,
  type FossilFuelKey,
  type NumericField,
} from "./model";
import {
  buildBiofuelOfferSummary,
  buildQuotationSummary,
} from "./quotation";
import { useMarketQuotes, type MarketQuotes } from "./useMarketQuotes";
import { loadInputs, saveInputs } from "./storage";
import { loadConsent, saveConsent, type ConsentState } from "./consent";
import { submitInputs } from "./submitInputs";
import { ConsentBanner, ConsentFootnote } from "./ConsentBanner";

const EMPTY_NOTE = { text: "", warn: false };

/** Dimmed while the figures on screen no longer match the form. */
const Results = styled.div<{ $stale: boolean }>`
  opacity: ${(p) => (p.$stale ? 0.5 : 1)};
  transition: opacity 0.18s ease;
`;

const StaleNotice = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(2)};
  background: ${ATTENTION_WASH};
  border: 1px solid ${ATTENTION};
  border-radius: 4px;
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(3)};
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: #8a6200;
  line-height: 1.5;

  b {
    ${theme.fontLabelBold};
  }
`;

const StaleDot = styled.span`
  flex: 0 0 auto;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${ATTENTION};
`;

export const SurplusCalculator = () => {
  const [stored] = useState(loadInputs);
  // `raw`/`fossil` are what the form shows; `committed` is what the results are
  // built from, so typing never makes the figures jump around mid-edit.
  const [fossil, setFossil] = useState<FossilFuelKey>(stored.fossil);
  const [raw, setRaw] = useState(stored.raw);
  const [committed, setCommitted] = useState(stored);
  const [consent, setConsent] = useState<ConsentState>(loadConsent);
  const [openHelp, setOpenHelp] = useState<HelpTopic | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [note, setNote] = useState(EMPTY_NOTE);

  const [fuelEmail, setFuelEmail] = useState("");
  const [fuelPhone, setFuelPhone] = useState("");
  const [imo, setImo] = useState("");
  const [fuelNote, setFuelNote] = useState(EMPTY_NOTE);

  const ctaRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const focusTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(focusTimer.current), []);

  // Everything typed by hand is kept locally so a return visit starts filled in.
  useEffect(() => saveInputs(fossil, raw), [fossil, raw]);

  const inputs = useMemo(
    () => toInputs(committed.fossil, committed.raw),
    [committed],
  );
  const result = useMemo(() => calculate(inputs), [inputs]);

  const dirty =
    fossil !== committed.fossil ||
    JSON.stringify(raw) !== JSON.stringify(committed.raw);

  const handleCalculate = () => {
    const next = { fossil, raw };
    setCommitted(next);

    if (consent === "granted") {
      const nextInputs = toInputs(fossil, raw);
      void submitInputs(nextInputs, calculate(nextInputs));
    }
  };

  const handleConsent = (granted: boolean) => {
    const state: ConsentState = granted ? "granted" : "denied";
    setConsent(state);
    saveConsent(state);
  };

  const applyQuotes = useCallback((quotes: MarketQuotes) => {
    const patch = {
      ...(quotes.eua !== undefined ? { eua: String(quotes.eua) } : {}),
      ...(quotes.fx !== undefined ? { fx: String(quotes.fx) } : {}),
    };
    setRaw((prev) => ({ ...prev, ...patch }));
    // A refreshed quote is not an edit the operator has to confirm.
    setCommitted((prev) => ({ ...prev, raw: { ...prev.raw, ...patch } }));
  }, []);

  const { status: quoteStatus, refresh } = useMarketQuotes(applyQuotes);

  const handleFossilChange = (next: FossilFuelKey) => {
    setFossil(next);
    // Reset to a typical price for the selected grade.
    setRaw((prev) => ({
      ...prev,
      priceFossil: String(FOSSIL_FUELS[next].price),
    }));
  };

  const handleFieldChange = (field: NumericField, value: string) =>
    setRaw((prev) => ({ ...prev, [field]: value }));

  const handleAsk = (topic: string) => {
    const next = topics.includes(topic) ? topics : [...topics, topic];
    setTopics(next);
    ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    focusTimer.current = window.setTimeout(
      () => emailRef.current?.focus({ preventScroll: true }),
      400,
    );
    setNote({
      text: `We will explain ${next.join(" and ").toLowerCase()} when we come back to you. Just leave a contact below.`,
      warn: false,
    });
  };

  const openMail = (subject: string, body: string) => {
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=` +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
  };

  const handleFuelSend = () => {
    if (!fuelEmail.trim() && !fuelPhone.trim()) {
      setFuelNote({
        text: "Add an email or a phone number so we can reach you.",
        warn: true,
      });
      return;
    }

    setFuelNote({
      text: "Opening your email client. Send the message and we will be in touch.",
      warn: false,
    });

    openMail(
      "Request for offer - marine biofuel",
      buildBiofuelOfferSummary(
        inputs,
        result,
        {
          email: fuelEmail.trim(),
          phone: fuelPhone.trim(),
          topics: [],
        },
        imo.trim(),
      ),
    );
  };

  const handleSend = () => {
    if (!email.trim() && !phone.trim()) {
      setNote({
        text: "Add an email or a phone number so we can reach you.",
        warn: true,
      });
      emailRef.current?.focus();
      return;
    }

    setNote({
      text: "Opening your email client. Send the message and we will be in touch.",
      warn: false,
    });

    openMail(
      "Request for quotation - FuelEU compliance units",
      buildQuotationSummary(inputs, result, {
        email: email.trim(),
        phone: phone.trim(),
        topics,
      }),
    );
  };

  return (
    <>
      {consent === "unset" && <ConsentBanner onDecide={handleConsent} />}
      <Columns>
      <InputsPanel
        fossil={fossil}
        raw={raw}
        fuelCi={result.fuel.ci}
        fuelEf={result.fuel.ef}
        quoteStatus={quoteStatus}
        dirty={dirty}
        recording={consent === "granted"}
        consentAnswered={consent !== "unset"}
        onCalculate={handleCalculate}
        openHelp={openHelp}
        onFossilChange={handleFossilChange}
        onFieldChange={handleFieldChange}
        onToggleHelp={(topic) =>
          setOpenHelp((open) => (open === topic ? null : topic))
        }
        onAsk={handleAsk}
        onRefresh={refresh}
      />

      <div>
        {dirty && (
          <StaleNotice role="status">
            <StaleDot />
            <span>
              <b>These figures are out of date.</b> They still show the last
              calculation — press Calculate to bring them up to date.
            </span>
          </StaleNotice>
        )}
        <Results $stale={dirty}>
          <HeadlineFigures result={result} />
          <LedgerPanel result={result} />
        </Results>
        <QuoteRequestCta
          surplus={result.surplus}
          contact={{
            email,
            phone,
            onEmailChange: setEmail,
            onPhoneChange: setPhone,
          }}
          note={note}
          sectionRef={ctaRef}
          emailRef={emailRef}
          onSend={handleSend}
        />
        <BiofuelOfferCta
          tons={inputs.tons}
          imo={imo}
          onImoChange={setImo}
          contact={{
            email: fuelEmail,
            phone: fuelPhone,
            onEmailChange: setFuelEmail,
            onPhoneChange: setFuelPhone,
          }}
          note={fuelNote}
          onSend={handleFuelSend}
        />
        <SensitivityPanel inputs={inputs} />
        <Assumptions
          result={result}
          consentNote={
            <ConsentFootnote
              granted={consent === "granted"}
              onChange={handleConsent}
            />
          }
        />
      </div>
      </Columns>
    </>
  );
};
