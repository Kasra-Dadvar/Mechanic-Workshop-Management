import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { deleteItem } from '../../clients/itemClient'
import { getErrorMessage } from '../../clients/httpClient'
import BackLink from '../../components/BackLink'
import ConfirmDialog from '../../components/ConfirmDialog'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { useItem } from './useItem'

export default function ItemDetailsPage() {
  const { itemId = '' } = useParams()
  const navigate = useNavigate()
  const { item, loading, error, reload } = useItem(itemId)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDelete() {
    if (!item) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteItem(item.id)
      navigate('/customers', { state: { notice: `Deleted item "${item.name}".` } })
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

      {loading && <LoadingState message="Loading item…" />}

      {!loading && error && (
        <ErrorState title="Could not load item" message={error} onRetry={reload} />
      )}

      {!loading && item && (
        <>
          <PageHeader
            title={`Item: ${item.name}`}
            actions={
              <>
                <Link to={`/items/${item.id}/edit`} className="button">
                  Edit item
                </Link>
                <button type="button" className="danger" onClick={() => setConfirmOpen(true)}>
                  Delete item
                </button>
              </>
            }
          />

          <dl className="details">
            <dt>Name</dt>
            <dd>{item.name}</dd>
            <dt>Service</dt>
            <dd>{item.serviceName ?? '—'}</dd>
            <dt>Cost</dt>
            <dd>{item.cost.toFixed(2)}</dd>
            <dt>Quantity</dt>
            <dd>{item.quantity}</dd>
          </dl>

          <ConfirmDialog
            open={confirmOpen}
            title="Delete item?"
            message={`Delete the item "${item.name}"? This cannot be undone.`}
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
