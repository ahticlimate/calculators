import styled from "styled-components";
import { breakpoints, theme } from "../../theme";

/**
 * Local primitives for the surplus calculator, built on the shared Ahti tokens.
 * Anything reusable beyond this tool belongs in common-styled-components instead.
 */

export const Panel = styled.section`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.grey(4)};
  border-radius: 4px;
  margin-bottom: ${theme.spacing(4)};
`;

export const PanelTitle = styled.h3`
  ${theme.fontLabelBold};
  ${theme.fontSize(-2)};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${theme.colors.dimBlue};
  margin: 0;
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  border-bottom: 1px solid ${theme.colors.grey(4)};
`;

export const PanelBody = styled.div`
  padding: ${theme.spacing(3)};
`;

export const Fieldset = styled.fieldset`
  border: 0;
  margin: 0 0 ${theme.spacing(3)};
  padding: 0;

  &:last-child {
    margin-bottom: ${theme.spacing(0)};
  }
`;

export const Legend = styled.legend`
  ${theme.fontLabelBold};
  ${theme.fontSize(-1)};
  color: ${theme.colors.darkBlue};
  padding: 0 0 ${theme.spacing(1)};
`;

export const Field = styled.div<{ $wide?: boolean }>`
  display: grid;
  grid-template-columns: ${(p) => (p.$wide ? "1fr" : "1fr 118px")};
  align-items: center;
  gap: ${theme.spacing(2)};
  padding: ${theme.spacing(0)} 0;
`;

export const FieldLabel = styled.label`
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${theme.colors.blackText};
`;

export const FieldHint = styled.small`
  display: block;
  ${theme.fontNormal};
  ${theme.fontSize(-2)};
  color: ${theme.colors.dimBlue};
  line-height: 1.35;
`;

export const InputShell = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${theme.colors.grey(4)};
  border-radius: 4px;
  background: ${theme.colors.white};
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;

  &:focus-within {
    border-color: ${theme.colors.lightBlue};
    box-shadow: 0 0 0 3px rgba(34, 125, 254, 0.12);
  }

  input,
  select {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    padding: ${theme.spacing(1)} ${theme.spacing(1)};
    ${theme.fontNormal};
    ${theme.fontSize(-1)};
    color: ${theme.colors.darkBlue};
    text-align: right;
  }

  select {
    text-align: left;
  }

  input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const Unit = styled.span`
  ${theme.fontNormal};
  ${theme.fontSize(-2)};
  color: ${theme.colors.dimBlue};
  padding: 0 ${theme.spacing(1)} 0 2px;
  white-space: nowrap;
`;

export const Meta = styled.p`
  ${theme.fontNormal};
  ${theme.fontSize(-2)};
  color: ${theme.colors.dimBlue};
  line-height: 1.5;
  margin: 2px 0 ${theme.spacing(1)};

  b {
    ${theme.fontLabelBold};
    color: ${theme.colors.darkBlue};
  }
`;

export const Hint = styled.p`
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${theme.colors.dimBlue};
  margin: ${theme.spacing(2)} 0 0;

  b {
    ${theme.fontLabelBold};
    color: ${theme.colors.darkBlue};
  }
`;

export const HelpToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid ${theme.colors.grey(4)};
  border-radius: 50%;
  background: ${theme.colors.white};
  color: ${theme.colors.dimBlue};
  ${theme.fontLabelBold};
  ${theme.fontSize(-3)};
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  vertical-align: 1px;

  &:hover {
    border-color: ${theme.colors.lightBlue};
    color: ${theme.colors.lightBlue};
  }

  &[aria-expanded="true"] {
    background: ${theme.colors.lightBlue};
    border-color: ${theme.colors.lightBlue};
    color: ${theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.lightBlue};
    outline-offset: 2px;
  }
`;

export const HelpBox = styled.div`
  background: ${theme.colors.backgroundLightBlue};
  border-left: 2px solid ${theme.colors.lightBlue};
  border-radius: 0 3px 3px 0;
  padding: ${theme.spacing(2)};
  margin: 2px 0 ${theme.spacing(2)};

  p {
    margin: 0;
    ${theme.fontNormal};
    ${theme.fontSize(-1)};
    color: ${theme.colors.dimBlue};
    line-height: 1.6;
  }
`;

export const AskLink = styled.button`
  border: 0;
  background: none;
  padding: 0;
  margin-top: 7px;
  cursor: pointer;
  ${theme.fontLabelBold};
  ${theme.fontSize(-1)};
  color: ${theme.colors.blue};

  &:hover {
    text-decoration: underline;
  }
`;

export const SmallButton = styled.button`
  border: 1px solid ${theme.colors.grey(4)};
  background: ${theme.colors.white};
  border-radius: 4px;
  cursor: pointer;
  ${theme.fontLabelBold};
  ${theme.fontSize(-3)};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.colors.dimBlue};
  padding: 7px 10px;
  white-space: nowrap;

  &:hover {
    border-color: ${theme.colors.lightBlue};
    color: ${theme.colors.lightBlue};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.lightBlue};
    outline-offset: 2px;
  }
`;

export const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 340px) minmax(0, 1fr);
  gap: ${theme.spacing(4)};
  align-items: start;
  width: 100%;

  @media (max-width: ${breakpoints.tablet}px) {
    grid-template-columns: 1fr;
  }
`;
