import styled from "styled-components";
import { breakpoints, theme } from "../../theme";
import { Hint, Panel, PanelBody, PanelTitle } from "./calculator-styles";
import { formatCompact } from "./format";
import {
  SENSITIVITY_INTENSITIES,
  calculate,
  type CalculatorInputs,
} from "./model";

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(${SENSITIVITY_INTENSITIES.length}, 1fr);
  gap: 1px;
  background: ${theme.colors.grey(4)};
  border: 1px solid ${theme.colors.grey(4)};
  border-radius: 4px;
  overflow: hidden;

  @media (max-width: ${breakpoints.mobilePlus}px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Cell = styled.div<{ $here: boolean }>`
  background: ${(p) =>
    p.$here ? theme.colors.backgroundLightBlue : theme.colors.white};
  padding: ${theme.spacing(2)} ${theme.spacing(2)};
  text-align: center;
`;

const Intensity = styled.div`
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${theme.colors.dimBlue};
`;

const Net = styled.div<{ $positive: boolean }>`
  ${theme.fontLabelBold};
  ${theme.fontSize(0)};
  margin-top: 3px;
  color: ${(p) => (p.$positive ? theme.colors.green : theme.colors.red)};
`;

export const SensitivityPanel = ({ inputs }: { inputs: CalculatorInputs }) => (
  <Panel>
    <PanelTitle>Net result at other biofuel intensities</PanelTitle>
    <PanelBody>
      <Strip>
        {SENSITIVITY_INTENSITIES.map((ciBio) => {
          const net = calculate(inputs, ciBio).net;
          return (
            <Cell key={ciBio} $here={Math.abs(ciBio - inputs.ciBio) < 0.5}>
              <Intensity>{ciBio} g/MJ</Intensity>
              <Net $positive={net >= 0}>{formatCompact(net)}</Net>
            </Cell>
          );
        })}
      </Strip>
      <Hint>
        Lower certified intensity means more surplus, and more penalty avoided,
        from the same tonnage.
      </Hint>
    </PanelBody>
  </Panel>
);
