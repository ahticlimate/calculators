import styled from "styled-components";
import { theme } from "../../theme";
import {
  PENALTY_EUR_PER_TONNE_VLSFO,
  VLSFO_MJ_PER_TONNE,
  type CalculatorResult,
} from "./model";
import { formatInt } from "./format";

const Caution = styled.aside`
  border: 1px solid ${theme.colors.grey(4)};
  border-left: 3px solid ${theme.colors.lightBlue};
  border-radius: 4px;
  background: ${theme.colors.white};
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(4)};

  h4 {
    margin: 0 0 6px;
    ${theme.fontLabelBold};
    ${theme.fontSize(-1)};
    color: ${theme.colors.darkBlue};
  }

  p {
    margin: 0 0 ${theme.spacing(1)};
    ${theme.fontNormal};
    ${theme.fontSize(-1)};
    color: ${theme.colors.dimBlue};
    line-height: 1.6;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const Footnotes = styled.footer`
  margin-top: ${theme.spacing(4)};
  border-top: 1px solid ${theme.colors.grey(4)};
  padding-top: ${theme.spacing(2)};
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${theme.colors.dimBlue};
  line-height: 1.7;

  b {
    ${theme.fontLabelBold};
    color: ${theme.colors.darkBlue};
  }

  ul {
    margin: 6px 0 0;
    padding-left: 17px;
  }

  li {
    margin: 3px 0;
  }
`;

const Stamp = styled.div`
  ${theme.fontLabelBold};
  ${theme.fontSize(-3)};
  letter-spacing: 0.13em;
  text-transform: uppercase;
  margin-top: ${theme.spacing(3)};
`;

export const Assumptions = ({ result }: { result: CalculatorResult }) => (
  <>
    <Caution>
      <h4>Your actual benefit depends on your FuelEU exposure</h4>
      <p>
        The figures above assume every tonne you switch is burned inside the
        FuelEU and EU ETS scope. In practice a surplus only arises on energy in
        scope: all energy used on intra-EEA voyages and at berth in EEA ports,
        half of the energy on voyages to or from a port outside the EEA, and
        none outside that. If part of the fuel is burned outside, both the
        surplus and the ETS saving fall proportionally. Send us your trade
        pattern and we will run it properly.
      </p>
      <p>
        The surplus is netted against your own position first. Whatever covers a
        deficit inside your own FuelEU reporting perimeter pays off as penalties
        avoided rather than as units sold, which is why the deficit figure moves
        the result so much more than the tonnage does. Only the remainder can be
        pooled. Final volumes are whatever your verifier confirms and THETIS-MRV
        records.
      </p>
    </Caution>

    <Footnotes>
      <b>How this is calculated.</b> Compliance balance follows FuelEU Maritime
      Annex IV: (target intensity − your biofuel intensity) × energy delivered
      in scope, converted to tCO₂e.
      <ul>
        <li>2026 target 89.34 gCO₂e/MJ, 2% below the 91.16 baseline.</li>
        <li>
          Fossil reference values from FuelEU Annex II: HFO/VLSFO 91.70
          gCO₂e/MJ and 3.114 tCO₂/t, LFO 91.40 and 3.151, MDO/MGO 90.77 and
          3.206.
        </li>
        <li>
          Biofuel replaces the fossil fuel one tonne for one tonne, at an energy
          content of 37 MJ/kg.
        </li>
        <li>
          Penalty avoided follows the Annex IV formula: the deficit divided by
          (attained intensity × {formatInt(VLSFO_MJ_PER_TONNE)} MJ), priced at €
          {formatInt(PENALTY_EUR_PER_TONNE_VLSFO)} per tonne of VLSFO
          equivalent. At {result.fuel.name} that is ${" "}
          {formatInt(result.penaltyRate)} per tCO₂e. Attained intensity is taken
          from the fossil grade you are replacing; your verified fleet average
          is the number that counts in a real filing.
        </li>
        <li>
          No allowance for the repeat-offender multiplier, which raises the
          penalty by a further 10% for each consecutive year in deficit from the
          second onwards.
        </li>
        <li>
          ETS saving assumes certified sustainable biofuel is zero-rated, at
          full phase-in.
        </li>
        <li>
          No RFNBO multiplier or wind reward factor. Surplus must be verified
          and reported in THETIS-MRV before it can be pooled.
        </li>
        <li>
          EUA quote is indicative front-month ICE EUA; FX is the ECB reference
          rate. Indicative figures only — not an offer. Unit prices are quoted
          case by case.
        </li>
      </ul>
      <Stamp>© Ahti Climate</Stamp>
    </Footnotes>
  </>
);
