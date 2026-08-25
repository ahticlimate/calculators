import styled from "styled-components";
import { theme } from "../../theme";
import {
  AskLink,
  Field,
  FieldHint,
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
  Unit,
} from "./calculator-styles";
import {
  FOSSIL_FUELS,
  FOSSIL_FUEL_ORDER,
  FALLBACK_QUOTE_DATE,
  type FossilFuelKey,
  type NumericField,
  type RawInputs,
} from "./model";
import { formatInt, formatTwo } from "./format";
import type { QuoteState } from "./useMarketQuotes";

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

const Dot = styled.span<{ $state: QuoteState }>`
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
        ? theme.colors.dimBlue
        : "#E0A31F"};
`;

const quoteText = (state: QuoteState, eua: number, fx: number) => {
  switch (state) {
    case "checking":
      return <>Checking live quotes…</>;
    case "live":
      return (
        <>
          Live: EUA <b>€{formatTwo(eua)}</b> · EUR/USD <b>{formatTwo(fx)}</b>
        </>
      );
    case "partial":
      return (
        <>
          Partly live — the other figure is the {FALLBACK_QUOTE_DATE} close.
          Edit above if needed.
        </>
      );
    case "stale":
      return (
        <>
          Live quotes unavailable — using the <b>{FALLBACK_QUOTE_DATE}</b>{" "}
          close. Edit above if needed.
        </>
      );
  }
};

type HelpTopic = "ciBio" | "ownDeficit";

interface InputsPanelProps {
  fossil: FossilFuelKey;
  raw: RawInputs;
  fuelCi: number;
  fuelEf: number;
  eua: number;
  fx: number;
  penaltyRate: number;
  quoteState: QuoteState;
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
  eua,
  fx,
  penaltyRate,
  quoteState,
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

        <Field>
          <FieldLabel htmlFor="tons">
            Tonnes replaced
            <FieldHint>Biofuel bunkered tonne for tonne</FieldHint>
          </FieldLabel>
          <InputShell>
            <input
              type="number"
              id="tons"
              min="0"
              step="10"
              value={raw.tons}
              onChange={(e) => onFieldChange("tons", e.target.value)}
            />
            <Unit>t</Unit>
          </InputShell>
        </Field>

        <Field>
          <FieldLabel htmlFor="ciBio">
            Biofuel GHG intensity
            <HelpToggle
              type="button"
              aria-expanded={openHelp === "ciBio"}
              aria-controls="help-ciBio"
              aria-label="Where do I find this number?"
              onClick={() => onToggleHelp("ciBio")}
            >
              ?
            </HelpToggle>
            <FieldHint>Certified well-to-wake value</FieldHint>
          </FieldLabel>
          <InputShell>
            <input
              type="number"
              id="ciBio"
              min="0"
              step="0.5"
              value={raw.ciBio}
              onChange={(e) => onFieldChange("ciBio", e.target.value)}
            />
            <Unit>g/MJ</Unit>
          </InputShell>
        </Field>

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
        <Legend>Your own position</Legend>
        <Field>
          <FieldLabel htmlFor="ownDeficit">
            Your own FuelEU deficit
            <HelpToggle
              type="button"
              aria-expanded={openHelp === "ownDeficit"}
              aria-controls="help-ownDeficit"
              aria-label="What counts as my own deficit?"
              onClick={() => onToggleHelp("ownDeficit")}
            >
              ?
            </HelpToggle>
            <FieldHint>Shortfall the surplus covers first</FieldHint>
          </FieldLabel>
          <InputShell>
            <input
              type="number"
              id="ownDeficit"
              min="0"
              step="50"
              value={raw.ownDeficit}
              onChange={(e) => onFieldChange("ownDeficit", e.target.value)}
            />
            <Unit>tCO₂e</Unit>
          </InputShell>
        </Field>
        <Meta>
          Penalty avoided <b>${formatInt(penaltyRate)}</b> per tCO₂e covered ·
          Annex IV at {formatTwo(fuelCi)} gCO₂e/MJ attained
        </Meta>

        {openHelp === "ownDeficit" && (
          <HelpBox id="help-ownDeficit">
            <p>
              The compliance shortfall your own vessels are carrying for the
              same reporting period, in tCO₂e. FuelEU nets the new surplus
              against it before anything can be pooled, so those tonnes pay off
              as penalties avoided rather than as units sold. Leave it at zero
              if your fleet is already compliant.
            </p>
            <AskLink type="button" onClick={() => onAsk("My FuelEU deficit")}>
              Ask Ahti about this →
            </AskLink>
          </HelpBox>
        )}
      </Fieldset>

      <Fieldset>
        <Legend>Prices</Legend>
        <Field>
          <FieldLabel htmlFor="priceFossil">Fossil fuel price</FieldLabel>
          <InputShell>
            <input
              type="number"
              id="priceFossil"
              min="0"
              step="5"
              value={raw.priceFossil}
              onChange={(e) => onFieldChange("priceFossil", e.target.value)}
            />
            <Unit>$/t</Unit>
          </InputShell>
        </Field>
        <Field>
          <FieldLabel htmlFor="priceBio">
            Biofuel price
            <FieldHint>Delivered, per tonne</FieldHint>
          </FieldLabel>
          <InputShell>
            <input
              type="number"
              id="priceBio"
              min="0"
              step="5"
              value={raw.priceBio}
              onChange={(e) => onFieldChange("priceBio", e.target.value)}
            />
            <Unit>$/t</Unit>
          </InputShell>
        </Field>
      </Fieldset>

      <Fieldset>
        <Legend>Market data</Legend>
        <Field>
          <FieldLabel htmlFor="eua">EUA price</FieldLabel>
          <InputShell>
            <input
              type="number"
              id="eua"
              min="0"
              step="0.05"
              value={raw.eua}
              onChange={(e) => onFieldChange("eua", e.target.value)}
            />
            <Unit>€/t</Unit>
          </InputShell>
        </Field>
        <Field>
          <FieldLabel htmlFor="fx">EUR / USD</FieldLabel>
          <InputShell>
            <input
              type="number"
              id="fx"
              min="0.1"
              step="0.0001"
              value={raw.fx}
              onChange={(e) => onFieldChange("fx", e.target.value)}
            />
            <Unit>rate</Unit>
          </InputShell>
        </Field>

        <QuoteRow>
          <QuoteSource aria-live="polite">
            <Dot $state={quoteState} />
            {quoteText(quoteState, eua, fx)}
          </QuoteSource>
          <SmallButton type="button" onClick={onRefresh}>
            Refresh
          </SmallButton>
        </QuoteRow>
      </Fieldset>
    </PanelBody>
  </Panel>
);

export type { HelpTopic };
