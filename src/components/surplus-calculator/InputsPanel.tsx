import styled from "styled-components";
import { theme } from "../../theme";
import {
  AskLink,
  Field,
  FieldLabel,
  Fieldset,
  HelpBox,
  HelpToggle,
  InputShell,
  Legend,
  Meta,
  Panel,
  PanelBody,
  PanelTitle,
  SmallButton,
  ATTENTION,
} from "./calculator-styles";
import {
  FOSSIL_FUELS,
  FOSSIL_FUEL_ORDER,
  FALLBACK_QUOTE_DATE,
  type FossilFuelKey,
  type NumericField,
  type RawInputs,
} from "./model";
import { formatTwo } from "./format";
import { NumberField } from "./NumberField";
import type { QuoteStatus, SourceState } from "./useMarketQuotes";

const CalculateRow = styled.div`
  margin-top: ${theme.spacing(3)};
  padding-top: ${theme.spacing(3)};
  border-top: 1px solid ${theme.colors.grey(4)};
`;

const CalculateButton = styled.button<{ $dirty: boolean }>`
  width: 100%;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  ${theme.fontLabelBold};
  font-size: 16px;
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  /* Amber while the results are out of date, grey only when disabled. */
  background: ${(p) => (p.$dirty ? ATTENTION : theme.colors.dimBlue)};
  color: ${(p) => (p.$dirty ? theme.colors.blackText : theme.colors.white)};
  transition: background 0.18s ease;

  &:hover:enabled {
    background: ${(p) => (p.$dirty ? "#C98D12" : theme.colors.darkBlue)};
  }

  &:disabled {
    background: ${theme.colors.grey(3)};
    color: ${theme.colors.grey(1)};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.blue};
    outline-offset: 2px;
  }
`;

const CalculateNote = styled.p<{ $dirty?: boolean }>`
  margin: ${theme.spacing(1)} 0 0;
  ${theme.fontNormal};
  ${theme.fontSize(-2)};
  color: ${(p) => (p.$dirty ? "#8A6200" : theme.colors.dimBlue)};
  line-height: 1.5;
  text-align: center;
`;

const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing(1)};
  margin-top: ${theme.spacing(2)};
`;

const QuoteSource = styled.div`
  ${theme.fontNormal};
  ${theme.fontSize(-2)};
  color: ${theme.colors.dimBlue};
  line-height: 1.4;

  b {
    ${theme.fontLabelBold};
    color: ${theme.colors.darkBlue};
  }
`;

const Dot = styled.span<{ $state: SourceState }>`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
  background: ${(p) =>
    p.$state === "live"
      ? theme.colors.green
      : p.$state === "checking"
        ? theme.colors.grey(3)
        : ATTENTION};
`;

/** Sits under its field so each quote says whether it refreshed or not. */
const FieldStatus = styled.div`
  grid-column: 1 / -1;
  text-align: right;
  ${theme.fontNormal};
  ${theme.fontSize(-2)};
  color: ${theme.colors.dimBlue};
  margin: -2px 0 ${theme.spacing(1)};
`;

const sourceLabel = (state: SourceState) => {
  switch (state) {
    case "checking":
      return "checking…";
    case "live":
      return "updated just now";
    case "stale":
      return `not updated — ${FALLBACK_QUOTE_DATE} close`;
  }
};

const summary = (status: QuoteStatus) => {
  if (status.eua === "checking" || status.fx === "checking") {
    return "Checking live quotes…";
  }
  if (status.eua === "live" && status.fx === "live") {
    return "Both quotes updated. Edit either if needed.";
  }
  if (status.eua === "stale" && status.fx === "stale") {
    return "No live quotes. Both figures are editable above.";
  }
  return "One quote updated, the other is editable above.";
};

type HelpTopic = "ciBio";

interface InputsPanelProps {
  fossil: FossilFuelKey;
  raw: RawInputs;
  fuelCi: number;
  fuelEf: number;
  quoteStatus: QuoteStatus;
  dirty: boolean;
  recording: boolean;
  consentAnswered: boolean;
  onCalculate: () => void;
  openHelp: HelpTopic | null;
  onFossilChange: (fossil: FossilFuelKey) => void;
  onFieldChange: (field: NumericField, value: string) => void;
  onToggleHelp: (topic: HelpTopic) => void;
  onAsk: (topic: string) => void;
  onRefresh: () => void;
}

export const InputsPanel = ({
  fossil,
  raw,
  fuelCi,
  fuelEf,
  quoteStatus,
  dirty,
  recording,
  consentAnswered,
  onCalculate,
  openHelp,
  onFossilChange,
  onFieldChange,
  onToggleHelp,
  onAsk,
  onRefresh,
}: InputsPanelProps) => (
  <Panel as="form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
    <PanelTitle>Your inputs</PanelTitle>
    <PanelBody>
      <Fieldset>
        <Legend>Fuel switch</Legend>

        <Field $wide>
          <FieldLabel htmlFor="fossil">Fossil fuel replaced</FieldLabel>
        </Field>
        <Field $wide>
          <InputShell>
            <select
              id="fossil"
              value={fossil}
              onChange={(e) => onFossilChange(e.target.value as FossilFuelKey)}
            >
              {FOSSIL_FUEL_ORDER.map((key) => (
                <option key={key} value={key}>
                  {FOSSIL_FUELS[key].name}
                </option>
              ))}
            </select>
          </InputShell>
        </Field>
        <Meta>
          WtW intensity {formatTwo(fuelCi)} gCO₂e/MJ · CO₂ factor{" "}
          {formatTwo(fuelEf)} t/t
        </Meta>

        <NumberField
          field="tons"
          label="Tonnes replaced"
          unit="t"
          hint="Biofuel bunkered tonne for tonne"
          step="10"
          value={raw.tons}
          onChange={onFieldChange}
        />
        <NumberField
          field="ciBio"
          label="Biofuel GHG intensity"
          unit="g/MJ"
          hint="Certified well-to-wake value"
          step="0.5"
          value={raw.ciBio}
          onChange={onFieldChange}
          adornment={
            <HelpToggle
              type="button"
              aria-expanded={openHelp === "ciBio"}
              aria-controls="help-ciBio"
              aria-label="Where do I find this number?"
              onClick={() => onToggleHelp("ciBio")}
            >
              ?
            </HelpToggle>
          }
        />
        {openHelp === "ciBio" && (
          <HelpBox id="help-ciBio">
            <p>
              Take it from the Proof of Sustainability your supplier issues with
              the fuel. It is the well-to-wake E value in gCO₂e/MJ. Certified
              waste-based FAME and HVO typically land between 10 and 25.
            </p>
            <AskLink
              type="button"
              onClick={() => onAsk("Biofuel GHG intensity")}
            >
              Ask Ahti about this →
            </AskLink>
          </HelpBox>
        )}
      </Fieldset>

      <Fieldset>
        <Legend>Prices</Legend>
        <NumberField
          field="priceFossil"
          label="Fossil fuel price"
          unit="$/t"
          step="5"
          value={raw.priceFossil}
          onChange={onFieldChange}
        />
        <NumberField
          field="priceBio"
          label="Biofuel price"
          unit="$/t"
          hint="Delivered, per tonne"
          step="5"
          value={raw.priceBio}
          onChange={onFieldChange}
        />
      </Fieldset>

      <Fieldset>
        <Legend>Market data</Legend>
        <NumberField
          field="eua"
          label="EUA price"
          unit="€/t"
          step="0.05"
          value={raw.eua}
          onChange={onFieldChange}
          status={
            <FieldStatus>
              <Dot $state={quoteStatus.eua} />
              {sourceLabel(quoteStatus.eua)}
            </FieldStatus>
          }
        />
        <NumberField
          field="poolPriceEur"
          label="Pooled unit price"
          unit="€/t"
          hint="What a pool pays per surplus unit"
          step="5"
          value={raw.poolPriceEur}
          onChange={onFieldChange}
        />
        <NumberField
          field="fx"
          label="EUR / USD"
          unit="rate"
          step="0.0001"
          value={raw.fx}
          onChange={onFieldChange}
          status={
            <FieldStatus>
              <Dot $state={quoteStatus.fx} />
              {sourceLabel(quoteStatus.fx)}
            </FieldStatus>
          }
        />
        <QuoteRow>
          <QuoteSource aria-live="polite">{summary(quoteStatus)}</QuoteSource>
          <SmallButton type="button" onClick={onRefresh}>
            Refresh
          </SmallButton>
        </QuoteRow>
      </Fieldset>

      <CalculateRow>
        <CalculateButton
          type="button"
          $dirty={dirty}
          disabled={!consentAnswered}
          onClick={onCalculate}
        >
          Calculate
        </CalculateButton>
        <CalculateNote $dirty={dirty} aria-live="polite">
          {!consentAnswered
            ? "Answer the recording question at the top of the page first. Either answer works."
            : dirty
              ? "Figures changed — the results still show the last calculation."
              : recording
                ? "Results are up to date. Your figures are recorded when you calculate."
                : "Results are up to date."}
        </CalculateNote>
      </CalculateRow>
    </PanelBody>
  </Panel>
);

export type { HelpTopic };
