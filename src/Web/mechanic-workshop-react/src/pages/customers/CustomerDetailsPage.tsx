import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { deleteCustomer } from '../../clients/customerClient'
import { getErrorMessage } from '../../clients/httpClient'
import BackLink from '../../components/BackLink'
import ConfirmDialog from '../../components/ConfirmDialog'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { useCustomer } from './useCustomer'

export default function CustomerDetailsPage() {
  const { customerId = '' } = useParams()
  const navigate = useNavigate()
  const { customer, loading, error, reload } = useCustomer(customerId)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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
