import styled from "styled-components";
import { theme } from "../../theme";
import { Hint, Panel, PanelBody, PanelTitle } from "./calculator-styles";
import { formatInt, formatSigned } from "./format";
import type { CalculatorResult } from "./model";

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

/** Header row that opens one of the two mutually exclusive routes. */
const RouteRow = styled.tr`
  && td {
    border-top: 2px solid ${theme.colors.darkBlue};
    padding-bottom: ${theme.spacing(0)};
    ${theme.fontLabelBold};
    ${theme.fontSize(-2)};
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: ${theme.colors.dimBlue};
  }
`;

const NetRow = styled.tr`
  && td {
    border-top: 1px solid ${theme.colors.grey(4)};
    ${theme.fontLabelBold};
    ${theme.fontSize(1)};
  }

  && ${Amount} {
    ${theme.fontSize(3)};
  }
`;

const LineNote = styled.span`
  display: block;
  ${theme.fontNormal};
  ${theme.fontSize(-2)};
  color: ${theme.colors.dimBlue};
  margin-top: 2px;
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

export const LedgerPanel = ({ result }: { result: CalculatorResult }) => {
  const scale = Math.max(
    result.penaltyAvoided,
    result.poolProfit,
    result.ets,
    Math.abs(result.premium),
    1,
  );
  const share = (value: number) => (Math.abs(value) / scale) * 100;
  const surplus = Math.max(result.surplus, 0);

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
                EU ETS cost avoided
                <LineNote>Earned either way, on the fuel itself</LineNote>
                <Bar $width={share(result.ets)} $color={theme.colors.lightBlue} />
              </td>
              <Amount $positive={result.ets >= 0}>
                {formatSigned(result.ets)}
              </Amount>
            </tr>
            <tr>
              <td>
                Biofuel premium paid
                <Bar $width={share(result.premium)} $color={theme.colors.red} />
              </td>
              <Amount $positive={result.premium < 0}>
                {formatSigned(-result.premium)}
              </Amount>
            </tr>

            <RouteRow>
              <td colSpan={2}>
                Then the surplus — {formatInt(surplus)} tCO₂e, one route or the
                other
              </td>
            </RouteRow>
            <tr>
              <td>
                FuelEU penalty avoided
                <LineNote>
                  Offsetting your own deficit at ${formatInt(result.penaltyRate)}{" "}
                  per tCO₂e
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
            <NetRow>
              <td>Net result, offsetting your own penalty</td>
              <Amount $positive={result.offsetNet >= 0}>
                {formatSigned(result.offsetNet)}
              </Amount>
            </NetRow>

            <RouteRow>
              <td colSpan={2}>Or instead</td>
            </RouteRow>
            <tr>
              <td>
                Profit from pooling the compliance
                <LineNote>
                  Selling the units at ${formatInt(result.poolRate)} per tCO₂e
                </LineNote>
                <Bar
                  $width={share(result.poolProfit)}
                  $color={theme.colors.lightGreen}
                />
              </td>
              <Amount $positive={result.poolProfit >= 0}>
                {formatSigned(result.poolProfit)}
              </Amount>
            </tr>
            <NetRow>
              <td>Net result, pooling the surplus</td>
              <Amount $positive={result.poolNet >= 0}>
                {formatSigned(result.poolNet)}
              </Amount>
            </NetRow>
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
                {formatInt(result.tons > 0 ? result.offsetValue / result.tons : 0)}{" "}
                per tonne offsetting your own penalty, $
                {formatInt(result.tons > 0 ? result.poolValue / result.tons : 0)}{" "}
                pooling it.
              </b>{" "}
              Below that, the switch pays for itself.
            </>
          )}
        </Hint>
      </PanelBody>
    </Panel>
  );
};
