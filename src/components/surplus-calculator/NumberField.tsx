import type { ReactNode } from "react";
import {
  Field,
  FieldHint,
  FieldLabel,
  InputShell,
  Unit,
} from "./calculator-styles";
import type { NumericField } from "./model";

interface NumberFieldProps {
  field: NumericField;
  label: string;
  unit: string;
  value: string;
  onChange: (field: NumericField, value: string) => void;
  hint?: string;
  step?: string;
  min?: string;
  /** Rendered after the label text, e.g. the help toggle. */
  adornment?: ReactNode;
  /** Rendered under the field, e.g. the live-quote marker. */
  status?: ReactNode;
}

/**
 * One numeric row of the form. Everything here that looks fussy is for phones:
 * `inputMode` asks for the numeric keypad instead of the full keyboard,
 * selecting on focus means a tap-and-type replaces the figure rather than
 * appending to it, and the 16px minimum on small screens stops iOS Safari
 * zooming the page every time a field takes focus.
 */
export const NumberField = ({
  field,
  label,
  unit,
  value,
  onChange,
  hint,
  step,
  min = "0",
  adornment,
  status,
}: NumberFieldProps) => (
  <Field>
    <FieldLabel htmlFor={field}>
      {label}
      {adornment}
      {hint && <FieldHint>{hint}</FieldHint>}
    </FieldLabel>
    <InputShell>
      <input
        type="number"
        inputMode="decimal"
        enterKeyHint="done"
        id={field}
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        onFocus={(e) => e.target.select()}
      />
      <Unit>{unit}</Unit>
    </InputShell>
    {status}
  </Field>
);
