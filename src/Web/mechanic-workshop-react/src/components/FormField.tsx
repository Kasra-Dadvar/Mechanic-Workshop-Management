interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  error?: string
  hint?: string
  required?: boolean
  autoComplete?: string
}

export default function FormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  error,
  hint,
  required = false,
  autoComplete,
}: FormFieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && (
        <p id={hintId} className="muted field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}
