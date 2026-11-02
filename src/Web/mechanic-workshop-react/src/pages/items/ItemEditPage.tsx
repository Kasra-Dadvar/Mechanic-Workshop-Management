import { useNavigate, useParams } from 'react-router'
import { updateItem } from '../../clients/itemClient'
import BackLink from '../../components/BackLink'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import type { UpdateItemRequest } from '../../models/items/item'
import ItemForm, { parseQuantity } from './ItemForm'
import type { ItemFormValues } from './ItemForm'
import { useItem } from './useItem'

export default function ItemEditPage() {
  const { itemId = '' } = useParams()
  const navigate = useNavigate()
  const { item, loading, error, reload } = useItem(itemId)

  async function handleSubmit(values: ItemFormValues) {
    const payload: UpdateItemRequest = {
      name: values.name.trim(),
      cost: Number(values.cost),
      quantity: parseQuantity(values.quantity),
    }
    await updateItem(itemId, payload)
    navigate(`/items/${itemId}`)
  }

  return (
    <>
      <p>
        <BackLink to={`/items/${itemId}`} label="Back to item" />
      </p>

      {loading && <LoadingState message="Loading item…" />}

      {!loading && error && (
        <ErrorState title="Could not load item" message={error} onRetry={reload} />
      )}

      {!loading && item && (
        <>
          <PageHeader title={`Edit Item: ${item.name}`} />
          <ItemForm
            mode="edit"
            initialValues={{
              name: item.name,
              cost: String(item.cost),
              quantity: String(item.quantity),
            }}
            submitLabel="Save changes"
            cancelTo={`/items/${itemId}`}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </>
  )
}
