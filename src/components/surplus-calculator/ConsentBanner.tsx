import styled from "styled-components";
import { breakpoints, theme } from "../../theme";

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing(3)};
  width: 100%;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.grey(4)};
  border-left: 3px solid ${theme.colors.lightBlue};
  border-radius: 4px;
  padding: ${theme.spacing(2)} ${theme.spacing(3)};

  @media (max-width: ${breakpoints.tablet}px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${theme.spacing(2)};
  }
`;

const Text = styled.p`
  margin: 0;
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${theme.colors.dimBlue};
  line-height: 1.6;

  b {
    ${theme.fontLabelBold};
    color: ${theme.colors.darkBlue};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing(2)};
  flex-shrink: 0;
`;

const Choice = styled.button<{ $primary?: boolean }>`
  border: 1px solid
    ${(p) => (p.$primary ? theme.colors.blue : theme.colors.grey(4))};
  background: ${(p) => (p.$primary ? theme.colors.blue : theme.colors.white)};
  color: ${(p) => (p.$primary ? theme.colors.white : theme.colors.dimBlue)};
  border-radius: 4px;
  cursor: pointer;
  ${theme.fontLabelBold};
  ${theme.fontSize(-1)};
  padding: ${theme.spacing(1)} ${theme.spacing(3)};
  white-space: nowrap;
  flex: 1 1 auto;

  &:hover {
    border-color: ${theme.colors.blue};
    color: ${(p) => (p.$primary ? theme.colors.white : theme.colors.blue)};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.blue};
    outline-offset: 2px;
  }
`;

export const ConsentBanner = ({
  onDecide,
}: {
  onDecide: (granted: boolean) => void;
}) => (
  <Bar role="region" aria-label="Data recording choice">
    <Text>
      <b>May we record the figures you enter?</b> Prices, tonnages and
      intensities help us keep track of what the market is actually paying. No
      contact details are recorded here, and the calculator works exactly the
      same either way — you can change your mind at the bottom of the page.
    </Text>
    <Actions>
      <Choice type="button" onClick={() => onDecide(false)}>
        No thanks
      </Choice>
      <Choice type="button" $primary onClick={() => onDecide(true)}>
        Allow
      </Choice>
    </Actions>
  </Bar>
);

/** Lets the choice be revisited, which consent has to allow. */
const Revisit = styled.button`
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
  ${theme.fontLabelBold};
  ${theme.fontSize(-1)};
  color: ${theme.colors.blue};
  text-decoration: underline;
`;

export const ConsentFootnote = ({
  granted,
  onChange,
}: {
  granted: boolean;
  onChange: (granted: boolean) => void;
}) => (
  <>
    {granted
      ? "You have allowed us to record the figures you enter. "
      : "The figures you enter are not being recorded. "}
    <Revisit type="button" onClick={() => onChange(!granted)}>
      {granted ? "Stop recording them" : "Allow recording"}
    </Revisit>
  </>
);
