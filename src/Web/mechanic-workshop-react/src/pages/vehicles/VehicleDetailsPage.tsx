import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getErrorMessage } from '../../clients/httpClient'
import { deleteService } from '../../clients/serviceClient'
import { deleteVehicle } from '../../clients/vehicleClient'
import BackLink from '../../components/BackLink'
import ConfirmDialog from '../../components/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/icons'
import type { Service } from '../../models/services/service'
import { useVehicle } from './useVehicle'
import { useVehicleServices } from './useVehicleServices'

export default function VehicleDetailsPage() {
  const { vehicleId = '' } = useParams()
  const navigate = useNavigate()
  const { vehicle, loading, error, reload } = useVehicle(vehicleId)
  const vehicleServices = useVehicleServices(vehicleId)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [pendingService, setPendingService] = useState<Service | null>(null)
  const [deletingService, setDeletingService] = useState(false)
  const [serviceDeleteError, setServiceDeleteError] = useState<string | null>(null)

  async function handleDeleteService() {
    if (!pendingService) return
    setDeletingService(true)
    setServiceDeleteError(null)
    try {
      await deleteService(pendingService.id)
      setPendingService(null)
      vehicleServices.reload()
    } catch (err) {
      setServiceDeleteError(getErrorMessage(err))
    } finally {
      setDeletingService(false)
    }
  }

  function closeServiceDialog() {
    setPendingService(null)
    setServiceDeleteError(null)
  }

  async function handleDelete() {
    if (!vehicle) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteVehicle(vehicle.id)
      navigate('/customers', { state: { notice: `Deleted vehicle "${vehicle.licensePlate}".` } })
    } catch (err) {
      setDeleteError(getErrorMessage(err))
      setDeleting(false)
    }
  }

  function closeDialog() {
    setConfirmOpen(false)
    setDeleteError(null)
  }

  return (
    <>
      <p>
        <BackLink to="/customers" label="Back to customers" />
      </p>

      {loading && <LoadingState message="Loading vehicle…" />}

      {!loading && error && (
        <ErrorState title="Could not load vehicle" message={error} onRetry={reload} />
      )}

      {!loading && vehicle && (
        <>
          <PageHeader
            title={`Vehicle: ${vehicle.make} ${vehicle.model}`}
            actions={
              <>
                <Link to={`/vehicles/${vehicle.id}/edit`} className="button">
                  Edit vehicle
                </Link>
                <button type="button" className="danger" onClick={() => setConfirmOpen(true)}>
                  Delete vehicle
                </button>
              </>
            }
          />

          <dl className="details">
            <dt>Make</dt>
            <dd>{vehicle.make}</dd>
            <dt>Model</dt>
            <dd>{vehicle.model}</dd>
            <dt>Year</dt>
            <dd>{vehicle.year}</dd>
            <dt>License plate</dt>
            <dd>{vehicle.licensePlate}</dd>
            <dt>Odometer</dt>
            <dd>{vehicle.odometer}</dd>
            <dt>Owner</dt>
            <dd>{vehicle.ownerName ?? '—'}</dd>
            <dt>Rego</dt>
            <dd>{vehicle.rego ? new Date(vehicle.rego).toLocaleDateString() : '—'}</dd>
          </dl>

          <div className="section-header">
            <h2>Services</h2>
            <Link to={`/vehicles/${vehicle.id}/services/new`} className="button primary">
              <PlusIcon />
              New service
            </Link>
          </div>

          {vehicleServices.loading && <LoadingState message="Loading services…" />}

          {!vehicleServices.loading && vehicleServices.error && (
            <ErrorState
              title="Could not load services"
              message={vehicleServices.error}
              onRetry={vehicleServices.reload}
            />
          )}

          {!vehicleServices.loading &&
            !vehicleServices.error &&
            vehicleServices.services.length === 0 && (
              <EmptyState title="No services for this vehicle" />
            )}

          {!vehicleServices.loading &&
            !vehicleServices.error &&
            vehicleServices.services.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Cost</th>
                    <th scope="col">Serviced on</th>
                    <th scope="col">Next service due</th>
                    <th scope="col">Next odometer due</th>
                    <th scope="col">
                      <span className="visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleServices.services.map((service) => (
                    <tr
                      key={service.id}
                      className="clickable"
                      onClick={(event) => {
                        // Links and action buttons handle their own clicks
                        if ((event.target as HTMLElement).closest('a, button')) return
                        navigate(`/services/${service.id}`)
                      }}
                    >
                      <td>
                        <Link to={`/services/${service.id}`} className="row-link">
                          {service.name}
                        </Link>
                      </td>
                      <td>{service.cost.toFixed(2)}</td>
                      <td>{new Date(service.servicedAt).toLocaleDateString()}</td>
                      <td>{new Date(service.nextServiceDue).toLocaleDateString()}</td>
                      <td>{service.nextOdometerDue}</td>
                      <td className="row-actions">
                        <div className="row-actions-inner">
                          <button
                            type="button"
                            className="row-action row-action-update"
                            title="Update service"
                            aria-label={`Update service ${service.name}`}
                            onClick={() => navigate(`/services/${service.id}/edit`)}
                          >
                            <PencilIcon />
                          </button>
                          <button
                            type="button"
                            className="row-action row-action-delete"
                            title="Delete service"
                            aria-label={`Delete service ${service.name}`}
                            onClick={() => setPendingService(service)}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          <ConfirmDialog
            open={confirmOpen}
            title="Delete vehicle?"
            message={`Delete the vehicle with plate ${vehicle.licensePlate}? This cannot be undone, and any services linked to it may also be removed.`}
            confirmLabel="Delete"
            busy={deleting}
            error={deleteError}
            onConfirm={handleDelete}
            onCancel={closeDialog}
          />

          <ConfirmDialog
            open={pendingService !== null}
            title="Delete service?"
            message={`Delete the service "${pendingService?.name ?? ''}"? This cannot be undone.`}
            confirmLabel="Delete"
            busy={deletingService}
            error={serviceDeleteError}
            onConfirm={handleDeleteService}
            onCancel={closeServiceDialog}
          />
        </>
      )}
    </>
  )
}
