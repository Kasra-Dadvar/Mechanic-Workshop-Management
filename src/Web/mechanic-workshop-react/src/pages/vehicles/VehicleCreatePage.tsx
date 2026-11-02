import { useNavigate, useParams } from 'react-router'
import { createVehicle } from '../../clients/vehicleClient'
import BackLink from '../../components/BackLink'
import PageHeader from '../../components/PageHeader'
import type { CreateVehicleRequest } from '../../models/vehicles/vehicle'
import { useCustomer } from '../customers/useCustomer'
import VehicleForm from './VehicleForm'
import type { VehicleFormValues } from './VehicleForm'

const emptyVehicle: VehicleFormValues = {
  make: '',
  model: '',
  year: '',
  odometer: '',
  licensePlate: '',
  rego: '',
}

export default function VehicleCreatePage() {
  const { customerId = '' } = useParams()
  const navigate = useNavigate()
  const { customer } = useCustomer(customerId)

  async function handleSubmit(values: VehicleFormValues) {
    const payload: CreateVehicleRequest = {
      make: values.make.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      odometer: Number(values.odometer),
      licensePlate: values.licensePlate.trim(),
      customerId,
      rego: values.rego || null,
    }
    const id = await createVehicle(payload)
    navigate(`/vehicles/${id}`)
  }

  return (
    <>
      <BackLink to={`/customers/${customerId}`} label="Back to customer" />
      <PageHeader
        title="New vehicle"
        subtitle={customer ? `Owner: ${customer.name}` : undefined}
      />
      <VehicleForm
        mode="create"
        initialValues={emptyVehicle}
        submitLabel="Create vehicle"
        cancelTo={`/customers/${customerId}`}
        onSubmit={handleSubmit}
      />
    </>
  )
}
