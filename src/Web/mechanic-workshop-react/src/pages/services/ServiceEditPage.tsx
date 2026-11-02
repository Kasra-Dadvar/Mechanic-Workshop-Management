import { useNavigate, useParams } from 'react-router'
import { updateService } from '../../clients/serviceClient'
import BackLink from '../../components/BackLink'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import type { UpdateServiceRequest } from '../../models/services/service'
import ServiceForm from './ServiceForm'
import type { ServiceFormValues } from './ServiceForm'
import { useService } from './useService'

// Keeps the stored timestamp when the date input is unchanged.
function toApiDate(formValue: string, original: string): string {
  return formValue === original.slice(0, 10) ? original : `${formValue}T00:00:00Z`
}

export default function ServiceEditPage() {
  const { serviceId = '' } = useParams()
  const navigate = useNavigate()
  const { service, loading, error, reload } = useService(serviceId)

  async function handleSubmit(values: ServiceFormValues) {
    if (!service) return
    const payload: UpdateServiceRequest = {
      name: values.name.trim(),
      cost: Number(values.cost),
      servicedAt: toApiDate(values.servicedAt, service.servicedAt),
      nextServiceDue: toApiDate(values.nextServiceDue, service.nextServiceDue),
      nextOdometerDue: Number(values.nextOdometerDue),
    }
    await updateService(serviceId, payload)
    navigate(`/services/${serviceId}`)
  }

  return (
    <>
      <p>
        <BackLink to={`/services/${serviceId}`} label="Back to service" />
      </p>

      {loading && <LoadingState message="Loading service…" />}

      {!loading && error && (
        <ErrorState title="Could not load service" message={error} onRetry={reload} />
      )}

      {!loading && service && (
        <>
          <PageHeader title={`Edit Service: ${service.name}`} />
          <ServiceForm
            mode="edit"
            initialValues={{
              name: service.name,
              cost: String(service.cost),
              servicedAt: service.servicedAt.slice(0, 10),
              nextServiceDue: service.nextServiceDue.slice(0, 10),
              nextOdometerDue: String(service.nextOdometerDue),
            }}
            submitLabel="Save changes"
            cancelTo={`/services/${serviceId}`}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </>
  )
}
