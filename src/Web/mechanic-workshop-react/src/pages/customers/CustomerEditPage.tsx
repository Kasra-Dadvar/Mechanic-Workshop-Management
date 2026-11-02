import { useNavigate, useParams } from 'react-router'
import BackLink from '../../components/BackLink'
import { updateCustomer } from '../../clients/customerClient'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import type { UpdateCustomerRequest } from '../../models/customers/customer'
import CustomerForm from './CustomerForm'
import { useCustomer } from './useCustomer'

export default function CustomerEditPage() {
  const { customerId = '' } = useParams()
  const navigate = useNavigate()
  const { customer, loading, error, reload } = useCustomer(customerId)

  async function handleSubmit(values: UpdateCustomerRequest) {
    await updateCustomer(customerId, values)
    navigate(`/customers/${customerId}`)
  }

  return (
    <>
      <p>
        <BackLink to={`/customers/${customerId}`} label="Back to customer" />
      </p>

      {loading && <LoadingState message="Loading customer…" />}

      {!loading && error && (
        <ErrorState title="Could not load customer" message={error} onRetry={reload} />
      )}

      {!loading && customer && (
        <>
          <PageHeader title={`Edit Customer: ${customer.name}`} />
          <CustomerForm
            initialValues={{
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
            }}
            submitLabel="Save changes"
            cancelTo={`/customers/${customerId}`}
            phoneHint="The API does not currently support removing a phone number once it is set."
            onSubmit={handleSubmit}
          />
        </>
      )}
    </>
  )
}
