import styled from "styled-components";
import { theme } from "../../theme";
import { Hint, Panel, PanelBody, PanelTitle } from "./calculator-styles";
import { formatCompact, formatInt, formatSigned } from "./format";
import type { CalculatorInputs, CalculatorResult } from "./model";

const Ledger = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;

  th {
    ${theme.fontLabelBold};
    ${theme.fontSize(-3)};
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: ${theme.colors.dimBlue};
    text-align: left;
    padding: 0 0 ${theme.spacing(1)};
  }

  th:last-child {
    text-align: right;
  }

  td {
    padding: ${theme.spacing(2)} 0;
    border-top: 1px solid ${theme.colors.grey(4)};
    ${theme.fontNormal};
    ${theme.fontSize(0)};
    color: ${theme.colors.darkBlue};
    vertical-align: middle;
  }
`;

const Amount = styled.td<{ $positive: boolean }>`
  && {
    text-align: right;
    ${theme.fontLabelBold};
    ${theme.fontSize(2)};
    letter-spacing: -0.01em;
    white-space: nowrap;
    color: ${(p) => (p.$positive ? theme.colors.green : theme.colors.red)};
  }
`;

const SummaryRow = styled.tr`
  && td {
    border-top: 2px solid ${theme.colors.darkBlue};
    ${theme.fontLabelBold};
    ${theme.fontSize(1)};
  }

  && ${Amount} {
    ${theme.fontSize(3)};
  }
`;

const TotalRow = styled(SummaryRow)`
  && td {
    padding-top: ${theme.spacing(2)};
  }
`;

const LineNote = styled.span`
  display: block;
  ${theme.fontNormal};
  ${theme.fontSize(-2)};
  color: ${theme.colors.dimBlue};
  margin-top: 2px;
`;

const Alternative = styled.div`
  margin-top: ${theme.spacing(3)};
  padding-top: ${theme.spacing(2)};
  border-top: 1px solid ${theme.colors.grey(4)};
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${theme.colors.dimBlue};
  line-height: 1.6;

  b {
    ${theme.fontLabelBold};
    color: ${theme.colors.darkBlue};
  }
`;

const Bar = styled.span<{ $width: number; $color: string }>`
  display: block;
  height: 7px;
  border-radius: 4px;
  margin-top: 9px;
  min-width: 2px;
  width: ${(p) => p.$width}%;
  background: ${(p) => p.$color};
`;

export const LedgerPanel = ({
  inputs,
  result,
}: {
  inputs: CalculatorInputs;
  result: CalculatorResult;
}) => {
  const scale = Math.max(
    result.penaltyAvoided,
    result.ets,
    Math.abs(result.premium),
    1,
  );
  const share = (value: number) => (Math.abs(value) / scale) * 100;

  return (
    <Panel>
      <PanelTitle>The numbers</PanelTitle>
      <PanelBody>
        <Ledger>
          <thead>
            <tr>
              <th>Line</th>
              <th>USD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                FuelEU penalty avoided
                <LineNote>
                  {formatInt(Math.max(result.surplus, 0))} tCO₂e at $
                  {formatInt(result.penaltyRate)} per tCO₂e
                </LineNote>
                <Bar
                  $width={share(result.penaltyAvoided)}
                  $color={theme.colors.green}
                />
              </td>
              <Amount $positive={result.penaltyAvoided >= 0}>
                {formatSigned(result.penaltyAvoided)}
              </Amount>
            </tr>
            <tr>
              <td>
                EU ETS cost avoided
                <Bar $width={share(result.ets)} $color={theme.colors.lightBlue} />
              </td>
              <Amount $positive={result.ets >= 0}>
                {formatSigned(result.ets)}
              </Amount>
            </tr>
            <SummaryRow>
              <td>Value created</td>
              <Amount $positive={result.value >= 0}>
                {formatSigned(result.value)}
              </Amount>
            </SummaryRow>
            <tr>
              <td>
                Biofuel premium paid
                <Bar $width={share(result.premium)} $color={theme.colors.red} />
              </td>
              <Amount $positive={result.premium < 0}>
                {formatSigned(-result.premium)}
              </Amount>
            </tr>
            <TotalRow>
              <td>Net result</td>
              <Amount $positive={result.net >= 0}>
                {formatSigned(result.net)}
              </Amount>
            </TotalRow>
          </tbody>
        </Ledger>

        <Hint>
          {result.surplus <= 0 ? (
            <>
              <b>No surplus at these inputs.</b> Check the biofuel intensity and
              the FuelEU scope.
            </>
          ) : (
            <>
              <b>
                Break-even biofuel premium: $
                {formatInt(result.tons > 0 ? result.value / result.tons : 0)} per
                tonne.
              </b>{" "}
              Below that, the switch pays for itself.
            </>
          )}
        </Hint>

        {result.surplus > 0 && (
          <Alternative>
            <b>Sold into a pool instead: {formatCompact(result.poolValue)}.</b>{" "}
            At €{formatInt(inputs.poolPriceEur)} per tCO₂e the same{" "}
            {formatInt(result.surplus)} tCO₂e fetches{" "}
            {formatCompact(result.poolValue)} rather than the{" "}
            {formatCompact(result.penaltyAvoided)} it saves against a penalty.
            These are alternatives, not additions — a tonne that offsets a
            deficit is no longer available to sell.
          </Alternative>
        )}
      </PanelBody>
    </Panel>
  );
};
