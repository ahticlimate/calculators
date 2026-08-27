import styled from "styled-components";
import logo from "../../assets/ahti-climate-logo.png";
import { formatInt, formatOne, formatRate, formatTwo } from "./format";
import { SensitivityChart, ValueBars } from "./PrintCharts";
import {
  PENALTY_EUR_PER_TONNE,
  TARGET_INTENSITY,
  type CalculatorInputs,
  type CalculatorResult,
} from "./model";

/**
 * A4 report, hidden on screen and revealed only for printing. Built separately
 * from the interactive UI rather than restyled out of it: the screen layout is
 * two columns of controls, and a printed record wants the inputs written out as
 * a reference table beside the figures they produced.
 *
 * Deliberately free of background fills — browsers drop those by default when
 * printing, so anything that depends on them prints wrong.
 */
const Sheet = styled.div`
  display: none;

  @media print {
    display: block;
    font-family: "Noto Sans", sans-serif;
    color: #000;
    font-size: 9.5pt;
    line-height: 1.35;
  }
`;

/** Everything that is not part of working out the value moves to page two. */
const Page = styled.div`
  break-after: page;

  &:last-child {
    break-after: auto;
  }
`;

const ContinuationHead = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8mm;
  border-bottom: 0.75pt solid #092960;
  padding-bottom: 2mm;
  margin-bottom: 4mm;
  font-size: 8.5pt;
  color: #36498d;

  b {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-weight: 800;
    font-size: 11pt;
    color: #092960;
  }
`;

const Lead = styled.p`
  margin: 0 0 3mm;
  font-size: 9pt;
  color: #092960;
`;

const Masthead = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12mm;
  border-bottom: 1.5pt solid #092960;
  padding-bottom: 2.5mm;
  margin-bottom: 4mm;

  img {
    width: 34mm;
    height: auto;
  }
`;

const Kicker = styled.p`
  margin: 0 0 1mm;
  font-size: 7.5pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #36498d;
`;

const Title = styled.h1`
  font-family: "Plus Jakarta Sans", sans-serif;
  font-weight: 800;
  font-size: 15pt;
  line-height: 1.12;
  margin: 0;
  color: #092960;
`;

const Prepared = styled.p`
  margin: 1.5mm 0 0;
  font-size: 8.5pt;
  color: #36498d;
`;

const Section = styled.section`
  margin-bottom: 3mm;
  break-inside: avoid;
`;

const SectionTitle = styled.h2`
  font-family: "Plus Jakarta Sans", sans-serif;
  font-weight: 800;
  font-size: 9pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #36498d;
  margin: 0 0 1.5mm;
  padding-bottom: 0.8mm;
  border-bottom: 0.5pt solid #a5abb0;
`;

const Rows = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;

  td {
    padding: 1.1mm 0;
    vertical-align: baseline;
    border-bottom: 0.25pt solid #d1d4d7;
  }

  td:last-child {
    text-align: right;
    white-space: nowrap;
  }

  tr:last-child td {
    border-bottom: 0;
  }
`;

const Note = styled.span`
  display: block;
  font-size: 8pt;
  color: #36498d;
`;

const Headline = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8mm;
  border: 0.75pt solid #092960;
  padding: 2.5mm 4mm;
  margin-bottom: 4mm;
  break-inside: avoid;

  span {
    font-size: 8.5pt;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #36498d;
  }

  b {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-weight: 800;
    font-size: 18pt;
    color: #092960;
  }
`;

const RouteHead = styled.tr`
  td {
    padding-top: 2.5mm;
    font-size: 8pt;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #36498d;
    border-bottom: 0.5pt solid #a5abb0;
  }
`;

const Net = styled.tr`
  td {
    font-weight: 700;
    border-bottom: 0.75pt solid #092960;
  }
`;

const Basis = styled.ul`
  margin: 0;
  padding-left: 4mm;
  font-size: 8pt;
  line-height: 1.3;
  color: #36498d;

  li {
    margin-bottom: 0.6mm;
  }
`;

const Footer = styled.footer`
  margin-top: 4mm;
  padding-top: 1.5mm;
  border-top: 0.5pt solid #a5abb0;
  font-size: 7.5pt;
  color: #36498d;
`;

const usd = (value: number) =>
  (value < 0 ? "−$" : "$") + formatInt(Math.abs(value));

export const PrintReport = ({
  inputs,
  result,
}: {
  inputs: CalculatorInputs;
  result: CalculatorResult;
}) => {
  const prepared = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Sheet data-print="report">
      <Page>
      <Masthead>
        <div>
          <Kicker>FuelEU Maritime 2026 · pooling supply side</Kicker>
          <Title>Compliance surplus calculation</Title>
          <Prepared>Prepared {prepared}</Prepared>
        </div>
        <img src={logo} alt="Ahti Climate" />
      </Masthead>

      <Headline>
        <span>Compliance surplus generated</span>
        <b>{formatInt(Math.max(result.surplus, 0))} tCO₂e</b>
      </Headline>

      <Section>
        <SectionTitle>The figures this is based on</SectionTitle>
        <Rows>
          <tbody>
            <tr>
              <td>
                Fossil fuel replaced
                <Note>
                  {formatTwo(result.fuel.ci)} gCO₂e/MJ well-to-wake ·{" "}
                  {formatTwo(result.fuel.ef)} tCO₂ per tonne
                </Note>
              </td>
              <td>{result.fuel.name}</td>
            </tr>
            <tr>
              <td>Tonnes replaced</td>
              <td>{formatInt(inputs.tons)} t</td>
            </tr>
            <tr>
              <td>
                Biofuel GHG intensity
                <Note>Certified well-to-wake value</Note>
              </td>
              <td>{formatOne(inputs.ciBio)} gCO₂e/MJ</td>
            </tr>
            <tr>
              <td>Fossil fuel price</td>
              <td>${formatInt(inputs.priceFossil)} / t</td>
            </tr>
            <tr>
              <td>Biofuel price, delivered</td>
              <td>${formatInt(inputs.priceBio)} / t</td>
            </tr>
            <tr>
              <td>EUA price</td>
              <td>€{formatTwo(inputs.eua)} / t</td>
            </tr>
            <tr>
              <td>Pooled unit price</td>
              <td>€{formatInt(inputs.poolPriceEur)} / tCO₂e</td>
            </tr>
            <tr>
              <td>EUR / USD</td>
              <td>{formatRate(inputs.fx)}</td>
            </tr>
          </tbody>
        </Rows>
      </Section>

      <Section>
        <SectionTitle>What the switch is worth</SectionTitle>
        <Rows>
          <tbody>
            <tr>
              <td>
                EU ETS cost avoided
                <Note>Earned either way, on the fuel itself</Note>
              </td>
              <td>{usd(result.ets)}</td>
            </tr>
            <tr>
              <td>Biofuel premium paid</td>
              <td>{usd(-result.premium)}</td>
            </tr>

            <RouteHead>
              <td colSpan={2}>
                Then the surplus — {formatInt(Math.max(result.surplus, 0))}{" "}
                tCO₂e, one route or the other
              </td>
            </RouteHead>
            <tr>
              <td>
                Profit from pooling the compliance
                <Note>
                  At €{formatInt(inputs.poolPriceEur)} per tCO₂e
                </Note>
              </td>
              <td>{usd(result.poolProfit)}</td>
            </tr>
            <Net>
              <td>Net result, pooling the surplus</td>
              <td>{usd(result.poolNet)}</td>
            </Net>
            <tr>
              <td>
                FuelEU penalty avoided
                <Note>
                  Offsetting your own deficit at ${formatInt(result.penaltyRate)}{" "}
                  per tCO₂e
                </Note>
              </td>
              <td>{usd(result.penaltyAvoided)}</td>
            </tr>
            <Net>
              <td>Net result, offsetting your own penalty</td>
              <td>{usd(result.offsetNet)}</td>
            </Net>
          </tbody>
        </Rows>
      </Section>

      <Section>
        <SectionTitle>Where the value sits</SectionTitle>
        <ValueBars result={result} />
      </Section>

      <Section>
        <SectionTitle>Net result at other biofuel intensities</SectionTitle>
        <SensitivityChart inputs={inputs} />
      </Section>
      </Page>

      <Page>
        <ContinuationHead>
          <b>Basis, scope and disclaimer</b>
          <span>Compliance surplus calculation · {prepared}</span>
        </ContinuationHead>

        <Lead>
          The figures on the previous page depend on assumptions that rarely
          hold in full. This page records them so the calculation can be checked
          rather than taken on trust.
        </Lead>

      <Section>
        <SectionTitle>Your actual benefit depends on your FuelEU exposure</SectionTitle>
        <Basis>
          <li>
            A surplus only arises on energy inside the FuelEU scope: all energy
            on intra-EEA voyages and at berth in EEA ports, half of the energy
            on voyages to or from a port outside the EEA, and none beyond that.
            If part of the fuel is burned outside, both the surplus and the ETS
            saving fall proportionally.
          </li>
          <li>
            The surplus is netted against your own position first. Whatever
            covers a deficit inside your own reporting perimeter pays off as
            penalties avoided rather than as units sold, and only the remainder
            can be pooled.
          </li>
          <li>
            Final volumes are whatever your verifier confirms and THETIS-MRV
            records. Nothing can be pooled before that.
          </li>
        </Basis>
      </Section>

      <Section>
        <SectionTitle>Basis and assumptions</SectionTitle>
        <Basis>
          <li>
            Compliance balance follows FuelEU Maritime Annex IV: (target
            intensity − biofuel intensity) × energy delivered in scope. The 2026
            target is {formatTwo(TARGET_INTENSITY)} gCO₂e/MJ.
          </li>
          <li>
            Biofuel replaces the fossil fuel one tonne for one tonne at 37
            MJ/kg, and is assumed zero-rated for ETS at full phase-in.
          </li>
          <li>
            The surplus is valued either as penalty avoided at €
            {formatInt(PENALTY_EUR_PER_TONNE)} per tCO₂e or at the pooled unit
            price — never both, since the same tonnes cannot do both.
          </li>
          <li>No RFNBO multiplier or wind reward factor is applied.</li>
          <li>
            The EUA figure is taken from the SparkChange Physical Carbon EUA
            ETC, which is backed by held allowances and quoted in euros. It
            tracks the allowance price closely but is not the ICE front-month
            settlement. FX is the ECB reference rate. Both were current when
            this sheet was prepared and can be overridden in the calculator.
          </li>
        </Basis>
      </Section>

      <Footer>
        Indicative figures only and not an offer. Unit prices are quoted case by
        case. Prepared with the Ahti Climate surplus calculator — © Ahti Climate
      </Footer>
      </Page>
    </Sheet>
  );
};
