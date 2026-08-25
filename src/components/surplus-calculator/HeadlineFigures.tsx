import styled from "styled-components";
import { breakpoints, theme } from "../../theme";
import { formatCompact, formatInt, formatTwo } from "./format";
import type { CalculatorResult } from "./model";

const Headline = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: ${theme.colors.grey(4)};
  border: 1px solid ${theme.colors.grey(4)};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${theme.spacing(4)};

  @media (max-width: ${breakpoints.mobile}px) {
    grid-template-columns: 1fr;
  }
`;

const Cell = styled.div`
  background: ${theme.colors.white};
  padding: ${theme.spacing(3)} ${theme.spacing(3)};
`;

const Label = styled.div`
  ${theme.fontLabelBold};
  ${theme.fontSize(-2)};
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: ${theme.colors.dimBlue};
`;

const Value = styled.div<{ $color: string }>`
  ${theme.fontTitle};
  ${theme.fontSize(4)};
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 6px 0 2px;
  color: ${(p) => p.$color};
`;

const Sub = styled.div`
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${theme.colors.dimBlue};
`;

export const HeadlineFigures = ({ result }: { result: CalculatorResult }) => (
  <Headline>
    <Cell>
      <Label>Compliance surplus generated</Label>
      <Value $color={theme.colors.green}>
        {formatInt(Math.max(result.surplus, 0))}
      </Value>
      <Sub>
        tCO₂e ·{" "}
        {formatTwo(result.tons > 0 ? result.surplus / result.tons : 0)} t per
        tonne of biofuel
      </Sub>
    </Cell>
    <Cell>
      <Label>Net result, pooling the surplus</Label>
      <Value
        $color={result.poolNet >= 0 ? theme.colors.blue : theme.colors.red}
      >
        {formatCompact(result.poolNet)}
      </Value>
      <Sub>
        after the biofuel premium · {formatCompact(result.offsetNet)} offsetting
        your own penalty instead
      </Sub>
    </Cell>
  </Headline>
);
