import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { deleteCustomer } from '../../clients/customerClient'
import { getErrorMessage } from '../../clients/httpClient'
import { deleteVehicle } from '../../clients/vehicleClient'
import BackLink from '../../components/BackLink'
import ConfirmDialog from '../../components/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/icons'
import type { Vehicle } from '../../models/vehicles/vehicle'
import { useCustomer } from './useCustomer'
import { useCustomerVehicles } from './useCustomerVehicles'

export default function CustomerDetailsPage() {
  const { customerId = '' } = useParams()
  const navigate = useNavigate()
  const { customer, loading, error, reload } = useCustomer(customerId)
  const vehicles = useCustomerVehicles(customerId)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [pendingVehicle, setPendingVehicle] = useState<Vehicle | null>(null)
  const [deletingVehicle, setDeletingVehicle] = useState(false)
  const [vehicleDeleteError, setVehicleDeleteError] = useState<string | null>(null)

  async function handleDeleteVehicle() {
    if (!pendingVehicle) return
    setDeletingVehicle(true)
    setVehicleDeleteError(null)
    try {
      await deleteVehicle(pendingVehicle.id)
      setPendingVehicle(null)
      vehicles.reload()
    } catch (err) {
      setVehicleDeleteError(getErrorMessage(err))
    } finally {
      setDeletingVehicle(false)
    }
  }

  function closeVehicleDialog() {
    setPendingVehicle(null)
    setVehicleDeleteError(null)
  }

  async function handleDelete() {
    if (!customer) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteCustomer(customer.id)
      navigate('/customers', { state: { notice: `Deleted customer "${customer.name}".` } })
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

      {loading && <LoadingState message="Loading customer…" />}

      {!loading && error && (
        <ErrorState title="Could not load customer" message={error} onRetry={reload} />
      )}

      {!loading && customer && (
        <>
          <PageHeader
            title={`Customer: ${customer.name}`}
            actions={
              <>
                <Link to={`/customers/${customer.id}/edit`} className="button">
                  Edit customer
                </Link>
                <button type="button" className="danger" onClick={() => setConfirmOpen(true)}>
                  Delete customer
                </button>
              </>
            }
          />

          <dl className="details">
            <dt>Name</dt>
            <dd>{customer.name}</dd>
            <dt>Email</dt>
            <dd>{customer.email}</dd>
            <dt>Phone</dt>
            <dd>{customer.phone ?? '—'}</dd>
          </dl>

          <div className="section-header">
            <h2>Vehicles</h2>
            <Link to={`/customers/${customer.id}/vehicles/new`} className="button primary">
              <PlusIcon />
              New vehicle
            </Link>
          </div>

          {vehicles.loading && <LoadingState message="Loading vehicles…" />}

          {!vehicles.loading && vehicles.error && (
            <ErrorState
              title="Could not load vehicles"
              message={vehicles.error}
              onRetry={vehicles.reload}
            />
          )}

          {!vehicles.loading && !vehicles.error && vehicles.vehicles.length === 0 && (
            <EmptyState title="No vehicles for this customer" />
          )}

          {!vehicles.loading && !vehicles.error && vehicles.vehicles.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th scope="col">Make</th>
                  <th scope="col">Model</th>
                  <th scope="col">Year</th>
                  <th scope="col">License plate</th>
                  <th scope="col">Odometer</th>
                  <th scope="col">Rego</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {vehicles.vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="clickable"
                    onClick={(event) => {
                      // Links and action buttons handle their own clicks
                      if ((event.target as HTMLElement).closest('a, button')) return
                      navigate(`/vehicles/${vehicle.id}`)
                    }}
                  >
                    <td>
                      <Link to={`/vehicles/${vehicle.id}`} className="row-link">
                        {vehicle.make}
                      </Link>
                    </td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.licensePlate}</td>
                    <td>{vehicle.odometer}</td>
                    <td>{vehicle.rego ? new Date(vehicle.rego).toLocaleDateString() : '—'}</td>
                    <td className="row-actions">
                      <div className="row-actions-inner">
                        <button
                          type="button"
                          className="row-action row-action-update"
                          title="Update vehicle"
                          aria-label={`Update vehicle ${vehicle.licensePlate}`}
                          onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          className="row-action row-action-delete"
                          title="Delete vehicle"
                          aria-label={`Delete vehicle ${vehicle.licensePlate}`}
                          onClick={() => setPendingVehicle(vehicle)}
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
            open={pendingVehicle !== null}
            title="Delete vehicle?"
            message={`Delete the vehicle with plate ${pendingVehicle?.licensePlate ?? ''}? This cannot be undone, and any services linked to it may also be removed.`}
            confirmLabel="Delete"
            busy={deletingVehicle}
            error={vehicleDeleteError}
            onConfirm={handleDeleteVehicle}
            onCancel={closeVehicleDialog}
          />

          <ConfirmDialog
            open={confirmOpen}
            title="Delete customer?"
            message={`Delete "${customer.name}"? This cannot be undone, and any data linked to this customer may also be removed.`}
            confirmLabel="Delete"
            busy={deleting}
            error={deleteError}
            onConfirm={handleDelete}
            onCancel={closeDialog}
          />
        </>
      )}
    </>
  )
}
