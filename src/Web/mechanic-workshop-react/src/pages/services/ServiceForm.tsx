import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { getErrorMessage } from '../../clients/httpClient'
import FormField from '../../components/FormField'

export interface ServiceFormValues {
  name: string
  cost: string
  servicedAt: string
  nextServiceDue: string
  nextOdometerDue: string
}

type FieldErrors = Partial<Record<keyof ServiceFormValues, string>>

interface ServiceFormProps {
  mode: 'create' | 'edit'
  initialValues: ServiceFormValues
  submitLabel: string
  cancelTo: string
  onSubmit: (values: ServiceFormValues) => Promise<void>
}

function isWholeNumber(value: string): boolean {
  return /^\d+$/.test(value.trim())
}

function isCost(value: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(value.trim())
}

function validate(mode: ServiceFormProps['mode'], values: ServiceFormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.name.trim()) errors.name = 'Name is required.'
  if (!isCost(values.cost)) errors.cost = 'Enter a cost of zero or more.'
  if (mode === 'edit') {
    if (!values.servicedAt) errors.servicedAt = 'Serviced date is required.'
    if (!values.nextServiceDue) errors.nextServiceDue = 'Next service due date is required.'
    if (!isWholeNumber(values.nextOdometerDue)) {
      errors.nextOdometerDue = 'Enter a whole number, zero or more.'
    }
  }
  return errors
}

export default function ServiceForm({
  mode,
  initialValues,
  submitLabel,
  cancelTo,
  onSubmit,
}: ServiceFormProps) {
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const isCreate = mode === 'create'

  function setField(field: keyof ServiceFormValues) {
    return (value: string) => setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const errors = validate(mode, values)
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
        id="service-name"
        label="Name"
        value={values.name}
        onChange={setField('name')}
        error={fieldErrors.name}
        required
      />
      <FormField
        id="service-cost"
        label="Cost"
        type="number"
        value={values.cost}
        onChange={setField('cost')}
        error={fieldErrors.cost}
        hint={isCreate ? undefined : 'The API ignores a cost of zero.'}
        required
      />
      {!isCreate && (
        <>
          <FormField
            id="service-serviced-at"
            label="Serviced on"
            type="date"
            value={values.servicedAt}
            onChange={setField('servicedAt')}
            error={fieldErrors.servicedAt}
            hint="The API only accepts a date later than the current one."
            required
          />
          <FormField
            id="service-next-due"
            label="Next service due"
            type="date"
            value={values.nextServiceDue}
            onChange={setField('nextServiceDue')}
            error={fieldErrors.nextServiceDue}
            hint="The API only accepts a future date."
            required
          />
          <FormField
            id="service-next-odometer"
            label="Next odometer due"
            type="number"
            value={values.nextOdometerDue}
            onChange={setField('nextOdometerDue')}
            error={fieldErrors.nextOdometerDue}
            hint="The API ignores values lower than the current one."
            required
          />
        </>
      )}
      <div className="form-actions">
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <Link to={cancelTo} className="cancel-link">Cancel</Link>
      </div>
    </form>
  )
}
