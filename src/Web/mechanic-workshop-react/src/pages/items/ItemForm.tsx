import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { getErrorMessage } from '../../clients/httpClient'
import FormField from '../../components/FormField'

export interface ItemFormValues {
  name: string
  cost: string
  quantity: string
}

type FieldErrors = Partial<Record<keyof ItemFormValues, string>>

interface ItemFormProps {
  mode: 'create' | 'edit'
  initialValues: ItemFormValues
  submitLabel: string
  cancelTo: string
  onSubmit: (values: ItemFormValues) => Promise<void>
}

// Blank quantity is sent as 0, which the API treats as its default (and ignores on update).
export function parseQuantity(value: string): number {
  return value.trim() === '' ? 0 : Number(value)
}

function isCost(value: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(value.trim()) && Number(value) > 0
}

function isOptionalWholeNumber(value: string): boolean {
  return value.trim() === '' || /^\d+$/.test(value.trim())
}

function validate(values: ItemFormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.name.trim()) errors.name = 'Name is required.'
  if (!isCost(values.cost)) errors.cost = 'Enter a cost greater than zero.'
  if (!isOptionalWholeNumber(values.quantity)) {
    errors.quantity = 'Enter a whole number, zero or more.'
  }
  return errors
}

export default function ItemForm({
  mode,
  initialValues,
  submitLabel,
  cancelTo,
  onSubmit,
}: ItemFormProps) {
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const isCreate = mode === 'create'

  function setField(field: keyof ItemFormValues) {
    return (value: string) => setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const errors = validate(values)
    setFieldErrors(errors)
    setSubmitError(null)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="form">
      {submitError && (
        <p role="alert" className="form-error">
          {submitError}
        </p>
      )}
      <FormField
        id="item-name"
        label="Name"
        value={values.name}
        onChange={setField('name')}
        error={fieldErrors.name}
        required
      />
      <FormField
        id="item-cost"
        label="Cost"
        type="number"
        value={values.cost}
        onChange={setField('cost')}
        error={fieldErrors.cost}
        hint="The API requires a cost greater than zero."
        required
      />
      <FormField
        id="item-quantity"
        label="Quantity"
        type="number"
        value={values.quantity}
        onChange={setField('quantity')}
        error={fieldErrors.quantity}
        hint={
          isCreate
            ? 'Leave blank to save with a quantity of 0.'
            : 'The API ignores a quantity of zero, so blank keeps the current value.'
        }
      />
      <div className="form-actions">
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <Link to={cancelTo} className="cancel-link">Cancel</Link>
      </div>
    </form>
  )
}
