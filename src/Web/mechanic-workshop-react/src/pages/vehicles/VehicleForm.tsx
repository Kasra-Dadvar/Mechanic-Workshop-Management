import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { getErrorMessage } from '../../clients/httpClient'
import FormField from '../../components/FormField'

export interface VehicleFormValues {
  make: string
  model: string
  year: string
  odometer: string
  licensePlate: string
  rego: string
}

type FieldErrors = Partial<Record<keyof VehicleFormValues, string>>

interface VehicleFormProps {
  mode: 'create' | 'edit'
  initialValues: VehicleFormValues
  submitLabel: string
  cancelTo: string
  onSubmit: (values: VehicleFormValues) => Promise<void>
}

function isWholeNumber(value: string): boolean {
  return /^\d+$/.test(value.trim())
}

function validate(mode: VehicleFormProps['mode'], values: VehicleFormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (mode === 'create') {
    if (!values.make.trim()) errors.make = 'Make is required.'
    if (!values.model.trim()) errors.model = 'Model is required.'
    if (!isWholeNumber(values.year) || Number(values.year) < 1900) {
      errors.year = 'Enter a valid year.'
    }
  }
  if (!isWholeNumber(values.odometer)) errors.odometer = 'Enter a whole number, zero or more.'
  if (!values.licensePlate.trim()) errors.licensePlate = 'License plate is required.'
  return errors
}

export default function VehicleForm({
  mode,
  initialValues,
  submitLabel,
  cancelTo,
  onSubmit,
}: VehicleFormProps) {
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const isCreate = mode === 'create'

  function setField(field: keyof VehicleFormValues) {
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
      {isCreate && (
        <>
          <FormField
            id="vehicle-make"
            label="Make"
            value={values.make}
            onChange={setField('make')}
            error={fieldErrors.make}
            required
          />
          <FormField
            id="vehicle-model"
            label="Model"
            value={values.model}
            onChange={setField('model')}
            error={fieldErrors.model}
            required
          />
          <FormField
            id="vehicle-year"
            label="Year"
            type="number"
            value={values.year}
            onChange={setField('year')}
            error={fieldErrors.year}
            required
          />
        </>
      )}
      <FormField
        id="vehicle-odometer"
        label="Odometer"
        type="number"
        value={values.odometer}
        onChange={setField('odometer')}
        error={fieldErrors.odometer}
        hint={isCreate ? undefined : 'The API ignores readings lower than the current odometer.'}
        required
      />
      <FormField
        id="vehicle-plate"
        label="License plate"
        value={values.licensePlate}
        onChange={setField('licensePlate')}
        error={fieldErrors.licensePlate}
        required
      />
      <FormField
        id="vehicle-rego"
        label="Rego"
        type="date"
        value={values.rego}
        onChange={setField('rego')}
        hint={isCreate ? undefined : 'The API cannot remove a rego date once it is set.'}
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
