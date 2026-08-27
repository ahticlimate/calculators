import { useState } from "react";
import styled from "styled-components";
import { breakpoints, theme } from "../../theme";
import { submitFeedback, type SubmitState } from "./netlifyForms";

const Wrap = styled.div`
  margin-top: ${theme.spacing(4)};
  padding-top: ${theme.spacing(3)};
  border-top: 1px solid ${theme.colors.grey(4)};
`;

const OpenButton = styled.button`
  border: 1px solid ${theme.colors.grey(4)};
  background: ${theme.colors.white};
  border-radius: 4px;
  cursor: pointer;
  ${theme.fontLabelBold};
  ${theme.fontSize(-1)};
  color: ${theme.colors.dimBlue};
  padding: ${theme.spacing(1)} ${theme.spacing(3)};

  &:hover {
    border-color: ${theme.colors.blue};
    color: ${theme.colors.blue};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.blue};
    outline-offset: 2px;
  }
`;

const Panel = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.grey(4)};
  border-radius: 4px;
  padding: ${theme.spacing(3)};
  max-width: 560px;
`;

const Label = styled.label`
  display: block;
  ${theme.fontLabelBold};
  ${theme.fontSize(-1)};
  color: ${theme.colors.darkBlue};
  margin-bottom: ${theme.spacing(1)};
`;

const Field = styled.div`
  margin-bottom: ${theme.spacing(2)};

  textarea,
  input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid ${theme.colors.grey(4)};
    border-radius: 4px;
    background: ${theme.colors.white};
    padding: ${theme.spacing(1)} ${theme.spacing(2)};
    ${theme.fontNormal};
    font-size: 16px; /* keeps iOS from zooming the page on focus */
    color: ${theme.colors.darkBlue};
    outline: 0;
  }

  textarea {
    min-height: 90px;
    resize: vertical;
    line-height: 1.5;
  }

  textarea:focus,
  input:focus {
    border-color: ${theme.colors.lightBlue};
    box-shadow: 0 0 0 3px rgba(34, 125, 254, 0.12);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(2)};
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.mobilePlus}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Send = styled.button`
  border: 0;
  border-radius: 4px;
  background: ${theme.colors.blue};
  color: ${theme.colors.white};
  cursor: pointer;
  ${theme.fontLabelBold};
  font-size: 16px;
  padding: ${theme.spacing(1)} ${theme.spacing(3)};

  &:hover:enabled {
    background: ${theme.colors.darkBlue};
  }

  &:disabled {
    background: ${theme.colors.grey(3)};
    color: ${theme.colors.grey(1)};
    cursor: not-allowed;
  }
`;

const Cancel = styled.button`
  border: 0;
  background: none;
  cursor: pointer;
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${theme.colors.dimBlue};
  text-decoration: underline;
  padding: 0;
`;

const Note = styled.p<{ $warn?: boolean }>`
  margin: ${theme.spacing(2)} 0 0;
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${(p) => (p.$warn ? theme.colors.red : theme.colors.dimBlue)};
`;

/**
 * Deliberately asks for as little as possible: the message is the point, and an
 * address only if the sender wants an answer.
 */
export const FeedbackWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  const send = async () => {
    if (!message.trim()) {
      setState("error");
      return;
    }
    setState("sending");
    setState(
      (await submitFeedback(message.trim(), email.trim())) ? "sent" : "error",
    );
  };

  if (!open) {
    return (
      <Wrap>
        <OpenButton type="button" onClick={() => setOpen(true)}>
          Send feedback
        </OpenButton>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Panel>
        {state === "sent" ? (
          <Note>
            Thank you — your note reached us. {email ? "We will reply." : ""}
          </Note>
        ) : (
          <>
            <Field>
              <Label htmlFor="feedbackMessage">
                Anything wrong, missing or confusing?
              </Label>
              <textarea
                id="feedbackMessage"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="What would make this more useful?"
              />
            </Field>
            <Field>
              <Label htmlFor="feedbackEmail">
                Email, only if you would like a reply
              </Label>
              <input
                id="feedbackEmail"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Optional"
              />
            </Field>
            <Actions>
              <Send
                type="button"
                disabled={state === "sending"}
                onClick={send}
              >
                {state === "sending" ? "Sending…" : "Send feedback"}
              </Send>
              <Cancel type="button" onClick={() => setOpen(false)}>
                Close
              </Cancel>
            </Actions>
            {state === "error" && (
              <Note $warn>
                {message.trim()
                  ? "That did not send. Please try again in a moment."
                  : "Add a message first."}
              </Note>
            )}
          </>
        )}
      </Panel>
    </Wrap>
  );
};
