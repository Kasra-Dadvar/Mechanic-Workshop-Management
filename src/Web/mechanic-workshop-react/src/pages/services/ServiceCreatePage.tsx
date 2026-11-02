import { useNavigate, useParams } from 'react-router'
import { createService } from '../../clients/serviceClient'
import BackLink from '../../components/BackLink'
import PageHeader from '../../components/PageHeader'
import type { CreateServiceRequest } from '../../models/services/service'
import { useVehicle } from '../vehicles/useVehicle'
import ServiceForm from './ServiceForm'
import type { ServiceFormValues } from './ServiceForm'

const emptyService: ServiceFormValues = {
  name: '',
  cost: '',
  servicedAt: '',
  nextServiceDue: '',
  nextOdometerDue: '',
}

export default function ServiceCreatePage() {
  const { vehicleId = '' } = useParams()
  const navigate = useNavigate()
  const { vehicle } = useVehicle(vehicleId)

  async function handleSubmit(values: ServiceFormValues) {
    const payload: CreateServiceRequest = {
      name: values.name.trim(),
      cost: Number(values.cost),
      vehicleId,
    }
    const id = await createService(payload)
    navigate(`/services/${id}`)
  }

  return (
    <>
      <BackLink to={`/vehicles/${vehicleId}`} label="Back to vehicle" />
      <PageHeader
        title="New service"
        subtitle={vehicle ? `Vehicle: ${vehicle.make} ${vehicle.model}` : undefined}
      />
      <ServiceForm
        mode="create"
        initialValues={emptyService}
        submitLabel="Create service"
        cancelTo={`/vehicles/${vehicleId}`}
        onSubmit={handleSubmit}
      />
    </>
  )
}
