import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { deleteCustomer } from '../../clients/customerClient'
import { getErrorMessage } from '../../clients/httpClient'
import ConfirmDialog from '../../components/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import Notice from '../../components/Notice'
import type { Customer } from '../../models/customers/customer'
import { useCustomers } from './useCustomers'

export default function CustomerListPage() {
  const { customers, loading, error, reload } = useCustomers()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [pendingDelete, setPendingDelete] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const search = searchParams.get('q') ?? ''
  const notice = (location.state as { notice?: string } | null)?.notice

  const term = search.trim().toLowerCase()
  const visibleCustomers = customers
    .filter((customer) =>
      [customer.name, customer.email, customer.phone ?? ''].some((value) =>
        value.toLowerCase().includes(term),
      ),
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  function handleSearchChange(value: string) {
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  async function handleDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteCustomer(pendingDelete.id)
      setPendingDelete(null)
      reload()
    } catch (err) {
      setDeleteError(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  function closeDeleteDialog() {
    setPendingDelete(null)
    setDeleteError(null)
  }

  function dismissNotice() {
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
  }

  return (
    <>
      <header className="list-header">
        <h1>Active Customers</h1>
      </header>

      {notice && <Notice message={notice} onDismiss={dismissNotice} />}

      {loading && <LoadingState message="Loading customers…" />}

      {!loading && error && (
        <ErrorState title="Could not load customers" message={error} onRetry={reload} />
      )}

      {!loading && !error && customers.length === 0 && (
        <EmptyState title="No customers yet">
          <Link to="/customers/new">Add your first customer</Link>
        </EmptyState>
      )}

      {!loading && !error && customers.length > 0 && (
        <>
          <div className="search-box">
            <label htmlFor="customer-search" className="visually-hidden">
              Search customers
            </label>
            <SearchIcon />
            <input
              id="customer-search"
              type="search"
              value={search}
              placeholder="filter by name email or phone number"
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </div>

          <p className="muted" role="status">
            {visibleCustomers.length} of {customers.length} customers
          </p>

          {visibleCustomers.length === 0 ? (
            <EmptyState title="No customers match your search" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="clickable"
                    onClick={(event) => {
                      // Links and action buttons handle their own clicks
                      if ((event.target as HTMLElement).closest('a, button')) return
                      navigate(`/customers/${customer.id}`)
                    }}
                  >
                    <td>
                      <Link to={`/customers/${customer.id}`} className="customer-name">
                        {customer.name}
                      </Link>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone ?? '—'}</td>
                    <td className="row-actions">
                      <div className="row-actions-inner">
                        <button
                          type="button"
                          className="row-action row-action-update"
                          title="Update customer"
                          aria-label={`Update ${customer.name}`}
                          onClick={() => navigate(`/customers/${customer.id}/edit`)}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          className="row-action row-action-delete"
                          title="Delete customer"
                          aria-label={`Delete ${customer.name}`}
                          onClick={() => setPendingDelete(customer)}
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
            open={pendingDelete !== null}
            title="Delete customer?"
            message={`Delete "${pendingDelete?.name ?? ''}"? This cannot be undone, and any data linked to this customer may also be removed.`}
            confirmLabel="Delete"
            busy={deleting}
            error={deleteError}
            onConfirm={handleDelete}
            onCancel={closeDeleteDialog}
          />

          <div className="list-footer">
            <Link to="/customers/new" className="button primary">
              <PlusIcon />
              New customer
            </Link>
          </div>
        </>
      )}
    </>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
