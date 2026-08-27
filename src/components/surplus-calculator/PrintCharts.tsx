import styled from "styled-components";
import { formatCompact, formatInt } from "./format";
import {
  SENSITIVITY_INTENSITIES,
  calculate,
  type CalculatorInputs,
  type CalculatorResult,
} from "./model";

/**
 * Print diagrams, drawn as SVG rather than with coloured backgrounds like their
 * counterparts on screen. Browsers drop background fills when printing unless
 * the reader has ticked "background graphics", so a CSS bar prints as an empty
 * gap. An SVG rect is page content and always comes out.
 */

const INK = {
  navy: "#092960",
  slate: "#36498d",
  rule: "#a5abb0",
  ets: "#227dfe",
  pool: "#19a476",
  penalty: "#4ddfb5",
  cost: "#d12e28",
};

const Block = styled.div`
  margin-top: 2mm;
  break-inside: avoid;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 52mm 1fr 22mm;
  align-items: center;
  gap: 2.5mm;
  margin-bottom: 0.9mm;
  font-size: 8pt;
  color: ${INK.navy};
`;

const Value = styled.span`
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const Caption = styled.p`
  margin: 1mm 0 0;
  font-size: 7.5pt;
  color: ${INK.slate};
`;

/** Relative size of each component of the result. */
export const ValueBars = ({ result }: { result: CalculatorResult }) => {
  const items = [
    { label: "EU ETS cost avoided", value: result.ets, fill: INK.ets },
    {
      label: "Profit from pooling",
      value: result.poolProfit,
      fill: INK.pool,
    },
    {
      label: "FuelEU penalty avoided",
      value: result.penaltyAvoided,
      fill: INK.penalty,
    },
    {
      label: "Biofuel premium paid",
      value: -result.premium,
      fill: INK.cost,
    },
  ];
  const max = Math.max(...items.map((i) => Math.abs(i.value)), 1);

  return (
    <Block>
      {items.map((item) => (
        <Row key={item.label}>
          <span>{item.label}</span>
          <svg
            viewBox="0 0 100 5"
            preserveAspectRatio="none"
            width="100%"
            height="2.6mm"
            role="img"
            aria-label={`${item.label}: ${formatInt(item.value)} USD`}
          >
            <rect
              x="0"
              y="0"
              width={Math.max((Math.abs(item.value) / max) * 100, 0.4)}
              height="5"
              fill={item.fill}
            />
          </svg>
          <Value>{formatCompact(item.value)}</Value>
        </Row>
      ))}
      <Caption>
        Bars are to scale against the largest figure. The two surplus routes are
        alternatives, so only one of them and the ETS saving apply at once.
      </Caption>
    </Block>
  );
};

/** Net result of the pooling route across the plausible range of biofuel intensity. */
export const SensitivityChart = ({ inputs }: { inputs: CalculatorInputs }) => {
  const points = SENSITIVITY_INTENSITIES.map((ciBio) => ({
    ciBio,
    net: calculate(inputs, ciBio).poolNet,
    here: Math.abs(ciBio - inputs.ciBio) < 0.5,
  }));

  const values = points.map((p) => p.net);
  const top = Math.max(...values, 0);
  const bottom = Math.min(...values, 0);
  const span = top - bottom || 1;

  // Plot area inside a 500 x 132 viewBox, leaving room for labels above and below.
  const PLOT_TOP = 20;
  const PLOT_H = 74;
  const zeroY = PLOT_TOP + ((top - 0) / span) * PLOT_H;
  const colW = 500 / points.length;
  const barW = colW * 0.44;

  return (
    <Block>
      <svg viewBox="0 0 500 132" width="100%" height="28mm" role="img">
        <line
          x1="0"
          y1={zeroY}
          x2="500"
          y2={zeroY}
          stroke={INK.rule}
          strokeWidth="0.8"
        />
        {points.map((p, i) => {
          const cx = i * colW + colW / 2;
          const y = PLOT_TOP + ((top - Math.max(p.net, 0)) / span) * PLOT_H;
          const h = Math.max((Math.abs(p.net) / span) * PLOT_H, 1);
          return (
            <g key={p.ciBio}>
              <rect
                x={cx - barW / 2}
                y={p.net >= 0 ? y : zeroY}
                width={barW}
                height={h}
                fill={p.net >= 0 ? INK.pool : INK.cost}
                opacity={p.here ? 1 : 0.55}
              />
              <text
                x={cx}
                y={p.net >= 0 ? y - 5 : zeroY + h + 12}
                textAnchor="middle"
                fontSize="12"
                fontWeight={p.here ? 700 : 400}
                fill={p.net >= 0 ? INK.navy : INK.cost}
              >
                {formatCompact(p.net)}
              </text>
              <text
                x={cx}
                y="128"
                textAnchor="middle"
                fontSize="11"
                fontWeight={p.here ? 700 : 400}
                fill={INK.slate}
              >
                {p.ciBio} g/MJ
              </text>
            </g>
          );
        })}
      </svg>
      <Caption>
        Net result of pooling the surplus at other certified biofuel
        intensities. Your figure is the solid bar; a lower intensity yields more
        surplus from the same tonnage.
      </Caption>
    </Block>
  );
};
