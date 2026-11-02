import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { getErrorMessage } from '../../clients/httpClient'
import FormField from '../../components/FormField'
import type { CreateCustomerRequest } from '../../models/customers/customer'

interface CustomerFormProps {
  initialValues: CreateCustomerRequest
  submitLabel: string
  cancelTo: string
  phoneHint?: string
  onSubmit: (values: CreateCustomerRequest) => Promise<void>
}

interface FieldErrors {
  name?: string
  email?: string
}

function validate(name: string, email: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!name.trim()) errors.name = 'Name is required.'
  if (!email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  return errors
}

export default function CustomerForm({
  initialValues,
  submitLabel,
  cancelTo,
  phoneHint,
  onSubmit,
}: CustomerFormProps) {
  const [name, setName] = useState(initialValues.name)
  const [email, setEmail] = useState(initialValues.email)
  const [phone, setPhone] = useState(initialValues.phone ?? '')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const errors = validate(name, email)
    setFieldErrors(errors)
    setSubmitError(null)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
      })
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
        id="customer-name"
        label="Name"
        value={name}
        onChange={setName}
        error={fieldErrors.name}
        autoComplete="name"
        required
      />
      <FormField
        id="customer-email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={fieldErrors.email}
        autoComplete="email"
        required
      />
      <FormField
        id="customer-phone"
        label="Phone"
        type="tel"
        value={phone}
        onChange={setPhone}
        hint={phoneHint}
        autoComplete="tel"
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
