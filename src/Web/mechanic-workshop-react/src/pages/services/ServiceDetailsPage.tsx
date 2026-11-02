import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { deleteItem } from '../../clients/itemClient'
import { deleteService } from '../../clients/serviceClient'
import { getErrorMessage } from '../../clients/httpClient'
import BackLink from '../../components/BackLink'
import ConfirmDialog from '../../components/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/icons'
import type { Item } from '../../models/items/item'
import { useService } from './useService'
import { useServiceItems } from './useServiceItems'

export default function ServiceDetailsPage() {
  const { serviceId = '' } = useParams()
  const navigate = useNavigate()
  const { service, loading, error, reload } = useService(serviceId)
  const serviceItems = useServiceItems(serviceId)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [pendingItem, setPendingItem] = useState<Item | null>(null)
  const [deletingItem, setDeletingItem] = useState(false)
  const [itemDeleteError, setItemDeleteError] = useState<string | null>(null)

  async function handleDelete() {
    if (!service) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteService(service.id)
      navigate('/customers', { state: { notice: `Deleted service "${service.name}".` } })
    } catch (err) {
      setDeleteError(getErrorMessage(err))
      setDeleting(false)
    }
  }

  function closeDialog() {
    setConfirmOpen(false)
    setDeleteError(null)
  }

  async function handleDeleteItem() {
    if (!pendingItem) return
    setDeletingItem(true)
    setItemDeleteError(null)
    try {
      await deleteItem(pendingItem.id)
      setPendingItem(null)
      serviceItems.reload()
    } catch (err) {
      setItemDeleteError(getErrorMessage(err))
    } finally {
      setDeletingItem(false)
    }
  }

  function closeItemDialog() {
    setPendingItem(null)
    setItemDeleteError(null)
  }

  return (
    <>
      <p>
        <BackLink to="/customers" label="Back to customers" />
      </p>

      {loading && <LoadingState message="Loading service…" />}

      {!loading && error && (
        <ErrorState title="Could not load service" message={error} onRetry={reload} />
      )}

      {!loading && service && (
        <>
          <PageHeader
            title={`Service: ${service.name}`}
            actions={
              <>
                <Link to={`/services/${service.id}/edit`} className="button">
                  Edit service
                </Link>
                <button type="button" className="danger" onClick={() => setConfirmOpen(true)}>
                  Delete service
                </button>
              </>
            }
          />

          <dl className="details">
            <dt>Name</dt>
            <dd>{service.name}</dd>
            <dt>Vehicle</dt>
            <dd>{service.vehicleName ?? '—'}</dd>
            <dt>Cost</dt>
            <dd>{service.cost.toFixed(2)}</dd>
            <dt>Serviced on</dt>
            <dd>{new Date(service.servicedAt).toLocaleDateString()}</dd>
            <dt>Next service due</dt>
            <dd>{new Date(service.nextServiceDue).toLocaleDateString()}</dd>
            <dt>Next odometer due</dt>
            <dd>{service.nextOdometerDue}</dd>
          </dl>

          <div className="section-header">
            <h2>Items</h2>
            <Link to={`/services/${service.id}/items/new`} className="button primary">
              <PlusIcon />
              New item
            </Link>
          </div>

          {serviceItems.loading && <LoadingState message="Loading items…" />}

          {!serviceItems.loading && serviceItems.error && (
            <ErrorState
              title="Could not load items"
              message={serviceItems.error}
              onRetry={serviceItems.reload}
            />
          )}

          {!serviceItems.loading && !serviceItems.error && serviceItems.items.length === 0 && (
            <EmptyState title="No items for this service" />
          )}

          {!serviceItems.loading && !serviceItems.error && serviceItems.items.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Cost</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviceItems.items.map((item) => (
                  <tr
                    key={item.id}
                    className="clickable"
                    onClick={(event) => {
                      // Links and action buttons handle their own clicks
                      if ((event.target as HTMLElement).closest('a, button')) return
                      navigate(`/items/${item.id}`)
                    }}
                  >
                    <td>
                      <Link to={`/items/${item.id}`} className="row-link">
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.cost.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td className="row-actions">
                      <div className="row-actions-inner">
                        <button
                          type="button"
                          className="row-action row-action-update"
                          title="Update item"
                          aria-label={`Update item ${item.name}`}
                          onClick={() => navigate(`/items/${item.id}/edit`)}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          className="row-action row-action-delete"
                          title="Delete item"
                          aria-label={`Delete item ${item.name}`}
                          onClick={() => setPendingItem(item)}
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
            title="Delete service?"
            message={`Delete the service "${service.name}"? This cannot be undone.`}
            confirmLabel="Delete"
            busy={deleting}
            error={deleteError}
            onConfirm={handleDelete}
            onCancel={closeDialog}
          />

          <ConfirmDialog
            open={pendingItem !== null}
            title="Delete item?"
            message={`Delete the item "${pendingItem?.name ?? ''}"? This cannot be undone.`}
            confirmLabel="Delete"
            busy={deletingItem}
            error={itemDeleteError}
            onConfirm={handleDeleteItem}
            onCancel={closeItemDialog}
          />
        </>
      )}
    </>
  )
}
