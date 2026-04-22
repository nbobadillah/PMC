import type { FormControlChangeEvent, OptionItem, QuoteForm } from "../../types/app";

interface FieldProps {
  label: string;
  name: keyof QuoteForm;
  value: string;
  options: OptionItem[];
  onChange: (event: FormControlChangeEvent) => void;
}

interface NumberFieldProps {
  label: string;
  name: keyof QuoteForm;
  value: number;
  min: number | string;
  max: number | string;
  onChange: (event: FormControlChangeEvent) => void;
}

interface ToggleFieldProps {
  label: string;
  name: keyof QuoteForm;
  checked: boolean;
  onChange: (event: FormControlChangeEvent) => void;
  hint: string;
}

export function Field({ label, name, value, options, onChange }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function NumberField({ label, name, value, min, max, onChange }: NumberFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" name={name} value={value} min={min} max={max} onChange={onChange} />
    </label>
  );
}

export function ToggleField({ label, name, checked, onChange, hint }: ToggleFieldProps) {
  return (
    <label className="toggle-field">
      <div>
        <span>{label}</span>
        <small>{hint}</small>
      </div>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
    </label>
  );
}
