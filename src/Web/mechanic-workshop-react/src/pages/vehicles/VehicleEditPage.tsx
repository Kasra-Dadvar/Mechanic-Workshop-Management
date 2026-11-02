import { useNavigate, useParams } from 'react-router'
import { updateVehicle } from '../../clients/vehicleClient'
import BackLink from '../../components/BackLink'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import type { UpdateVehicleRequest } from '../../models/vehicles/vehicle'
import VehicleForm from './VehicleForm'
import type { VehicleFormValues } from './VehicleForm'
import { useVehicle } from './useVehicle'

export default function VehicleEditPage() {
  const { vehicleId = '' } = useParams()
  const navigate = useNavigate()
  const { vehicle, loading, error, reload } = useVehicle(vehicleId)

  async function handleSubmit(values: VehicleFormValues) {
    // customerId is omitted so the API keeps the current owner.
    const payload: UpdateVehicleRequest = {
      odometer: Number(values.odometer),
      licensePlate: values.licensePlate.trim(),
      rego: values.rego || null,
    }
    await updateVehicle(vehicleId, payload)
    navigate(`/vehicles/${vehicleId}`)
  }

  return (
    <>
      <p>
        <BackLink to={`/vehicles/${vehicleId}`} label="Back to vehicle" />
      </p>

      {loading && <LoadingState message="Loading vehicle…" />}

      {!loading && error && (
        <ErrorState title="Could not load vehicle" message={error} onRetry={reload} />
      )}

      {!loading && vehicle && (
        <>
          <PageHeader title={`Edit Vehicle: ${vehicle.make} ${vehicle.model}`} />
          <VehicleForm
            mode="edit"
            initialValues={{
              make: vehicle.make,
              model: vehicle.model,
              year: String(vehicle.year),
              odometer: String(vehicle.odometer),
              licensePlate: vehicle.licensePlate,
              rego: vehicle.rego ? vehicle.rego.slice(0, 10) : '',
            }}
            submitLabel="Save changes"
            cancelTo={`/vehicles/${vehicleId}`}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </>
  )
}
