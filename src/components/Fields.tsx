import { useRef, type ReactNode } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Fa } from './Icon';

export function Field({ label, hint, children, className }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={'c-field ' + (className ?? '')}>
      <span className="c-label">{label}</span>
      {children}
      {hint && <span className="c-hint">{hint}</span>}
    </label>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="c-row">{children}</div>;
}

export function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className="c-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function TextArea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea className="c-input c-textarea" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />;
}

export function Select({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <span className={'c-select' + (disabled ? ' is-disabled' : '')}>
      <select className="c-input" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Fa icon={faChevronDown} size={14} className="c-select-chev" />
    </span>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="c-seg" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className={'c-seg-btn' + (o.value === value ? ' is-on' : '')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Switch({ on, onChange, label, detail, hideLabel }: { on: boolean; onChange: (v: boolean) => void; label: string; detail?: string; hideLabel?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={hideLabel ? label : undefined}
      className={'c-switch' + (on ? ' is-on' : '')}
      onClick={() => onChange(!on)}
    >
      <span className="c-switch-track">
        <span className="c-switch-knob" />
      </span>
      {!hideLabel && (
        <span className="c-switch-text">
          <span className="c-switch-label">{label}</span>
          {detail && <span className="c-switch-detail">{detail}</span>}
        </span>
      )}
    </button>
  );
}

// Text input with a button that drops a {token} at the cursor
export function TokenInput({ value, onChange, token = 'first_name', tokenLabel = 'First name' }: { value: string; onChange: (v: string) => void; token?: string; tokenLabel?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const insert = () => {
    const el = ref.current;
    const at = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? at;
    const next = value.slice(0, at) + `{${token}}` + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el?.focus();
      const pos = at + token.length + 2;
      el?.setSelectionRange(pos, pos);
    });
  };
  return (
    <span className="c-token">
      <input ref={ref} className="c-input" value={value} onChange={(e) => onChange(e.target.value)} />
      <button type="button" className="c-token-btn" onClick={insert}>
        + {tokenLabel}
      </button>
    </span>
  );
}

export function Btn({ children, kind = 'dark', onClick }: { children: ReactNode; kind?: 'dark' | 'light' | 'plain'; onClick?: () => void }) {
  return (
    <button type="button" className={'c-btn is-' + kind} onClick={onClick}>
      {children}
    </button>
  );
}
