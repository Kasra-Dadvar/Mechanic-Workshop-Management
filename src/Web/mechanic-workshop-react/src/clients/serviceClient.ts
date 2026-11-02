import type { Item } from '../models/items/item'
import type {
  CreateServiceRequest,
  Service,
  UpdateServiceRequest,
  UpdateServiceResponse,
} from '../models/services/service'
import { request } from './httpClient'

export function getService(id: string): Promise<Service> {
  return request<Service>(`/services/${id}`)
}

export function getServiceItems(id: string): Promise<Item[]> {
  return request<Item[]>(`/services/${id}/items`)
}

// The API responds with the new service's id as a plain JSON string.
export function createService(data: CreateServiceRequest): Promise<string> {
  return request<string>('/services', { method: 'POST', body: data })
}

export function updateService(
  id: string,
  data: UpdateServiceRequest,
): Promise<UpdateServiceResponse> {
  return request<UpdateServiceResponse>(`/services/${id}/update`, {
    method: 'PUT',
    body: data,
  })
}

export function deleteService(id: string): Promise<void> {
  return request<void>(`/services/${id}/delete`, { method: 'DELETE' })
}
