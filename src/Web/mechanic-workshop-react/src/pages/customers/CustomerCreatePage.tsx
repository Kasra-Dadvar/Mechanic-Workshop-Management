import { useNavigate } from 'react-router'
import { createCustomer } from '../../clients/customerClient'
import BackLink from '../../components/BackLink'
import PageHeader from '../../components/PageHeader'
import type { CreateCustomerRequest } from '../../models/customers/customer'
import CustomerForm from './CustomerForm'

const emptyCustomer: CreateCustomerRequest = { name: '', email: '', phone: null }

export default function CustomerCreatePage() {
  const navigate = useNavigate()

  async function handleSubmit(values: CreateCustomerRequest) {
    const id = await createCustomer(values)
    navigate(`/customers/${id}`)
  }

  return (
    <>
      <BackLink to="/customers" label="Back to customers" />
      <PageHeader title="New customer" />
      <CustomerForm
        initialValues={emptyCustomer}
        submitLabel="Create customer"
        cancelTo="/customers"
        onSubmit={handleSubmit}
      />
    </>
  )
}
