const ratio = 1.25;
const baseFontSize = 16;

const fontSizeNumber = (step: number): number => {
  const size = baseFontSize * Math.pow(ratio, step);
  return size;
};

const fontSize = (step: number): string => {
  const size = fontSizeNumber(step);
  return `font-size: ${size}px`;
};

const spacingRatio = 1.618;
const spacingBase = 4;

const spacingNumber = (step: number): number => {
  return spacingBase * Math.pow(spacingRatio, step);
};

const spacing = (step: number): string => {
  return `${spacingNumber(step)}px`;
};

const greys = [
  "#20262C",
  "#52595F",
  "#A5ABB0",
  "#D1D4D7",
  "#EAEAEA",
  "#F2F2F2",
];

const grey = (step: number): string => {
  return step < 0 ? "black" : step >= greys.length ? "white" : greys[step];
};

export const colors = {
  black: "black",
  white: "#ffffff",
  grey,
  red: "#D12E28",
  bluelink: "#0941D6",
  darkBlue: "#092960",
  dimBlue: "#36498D",
  blue: "#0941D6",
  blueGradientEnd: "#0034BD",
  lightBlue: "#227DFE",
  lightGreen: "#4DDFB5",
  green: "#19A476",
  darkGreen: "#096245",
  darkestGreen: "#012117",
  greenScale: ["#19A476", "#096245", "#012117"],
  text: "#092960",
  blackText: "#000",
  backgroundLightBlue: "#e9e9f3",
};

export const theme = {
  fontTitle: `
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-style: normal;
    font-weight: 800
  `,
  fontBold: `
    font-family: 'Noto Sans', sans-serif;
    font-style: normal;
    font-weight: 700;
    line-height: 1.5
  `,
  fontNormal: `
    font-family: 'Noto Sans', sans-serif;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5
  `,
  fontLabel: `
    font-family: 'Noto Sans', sans-serif;
    font-style: normal;
    font-weight: 400
  `,
  fontLabelBold: `
    font-family: 'Noto Sans', sans-serif;
    font-style: normal;
    font-weight: 700
  `,
  spacing,
  spacingNumber,
  fontSize,
  fontSizeNumber,
  colors,
};

export const breakpoints = {
  mobile: 480,
  mobilePlus: 640,
  tablet: 920,
  desktop: 1220,
};
