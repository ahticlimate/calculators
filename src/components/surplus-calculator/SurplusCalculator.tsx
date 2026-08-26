import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Columns } from "./calculator-styles";
import { Assumptions } from "./Assumptions";
import { HeadlineFigures } from "./HeadlineFigures";
import { InputsPanel, type HelpTopic } from "./InputsPanel";
import { LedgerPanel } from "./LedgerPanel";
import { QuoteRequestCta } from "./QuoteRequestCta";
import { BiofuelOfferCta } from "./BiofuelOfferCta";
import { SensitivityPanel } from "./SensitivityPanel";
import {
  CONTACT_EMAIL,
  DEFAULT_FOSSIL,
  DEFAULT_RAW_INPUTS,
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

const EMPTY_NOTE = { text: "", warn: false };

export const SurplusCalculator = () => {
  const [fossil, setFossil] = useState<FossilFuelKey>(DEFAULT_FOSSIL);
  const [raw, setRaw] = useState(DEFAULT_RAW_INPUTS);
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

  const inputs = useMemo(() => toInputs(fossil, raw), [fossil, raw]);
  const result = useMemo(() => calculate(inputs), [inputs]);

  const applyQuotes = useCallback((quotes: MarketQuotes) => {
    setRaw((prev) => ({
      ...prev,
      ...(quotes.eua !== undefined ? { eua: String(quotes.eua) } : {}),
      ...(quotes.fx !== undefined ? { fx: String(quotes.fx) } : {}),
    }));
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
    <Columns>
      <InputsPanel
        fossil={fossil}
        raw={raw}
        fuelCi={result.fuel.ci}
        fuelEf={result.fuel.ef}
        quoteStatus={quoteStatus}
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
        <HeadlineFigures result={result} />
        <LedgerPanel result={result} />
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
        <Assumptions result={result} />
      </div>
    </Columns>
  );
};
