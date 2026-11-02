import { useNavigate, useParams } from 'react-router'
import { createItem } from '../../clients/itemClient'
import BackLink from '../../components/BackLink'
import PageHeader from '../../components/PageHeader'
import type { CreateItemRequest } from '../../models/items/item'
import { useService } from '../services/useService'
import ItemForm, { parseQuantity } from './ItemForm'
import type { ItemFormValues } from './ItemForm'

const emptyItem: ItemFormValues = {
  name: '',
  cost: '',
  quantity: '',
}

export default function ItemCreatePage() {
  const { serviceId = '' } = useParams()
  const navigate = useNavigate()
  const { service } = useService(serviceId)

  async function handleSubmit(values: ItemFormValues) {
    const payload: CreateItemRequest = {
      name: values.name.trim(),
      cost: Number(values.cost),
      quantity: parseQuantity(values.quantity),
      serviceId,
    }
    await createItem(payload)
    navigate(`/services/${serviceId}`)
  }

  return (
    <>
      <BackLink to={`/services/${serviceId}`} label="Back to service" />
      <PageHeader
        title="New item"
        subtitle={service ? `Service: ${service.name}` : undefined}
      />
      <ItemForm
        mode="create"
        initialValues={emptyItem}
        submitLabel="Create item"
        cancelTo={`/services/${serviceId}`}
        onSubmit={handleSubmit}
      />
    </>
  )
}
