import type {
  CreateItemRequest,
  Item,
  UpdateItemRequest,
  UpdateItemResponse,
} from '../models/items/item'
import { request } from './httpClient'

export function getItem(id: string): Promise<Item> {
  return request<Item>(`/items/${id}`)
}

// The API responds with the new item's id as a plain JSON string.
export function createItem(data: CreateItemRequest): Promise<string> {
  return request<string>('/items', { method: 'POST', body: data })
}

export function updateItem(id: string, data: UpdateItemRequest): Promise<UpdateItemResponse> {
  return request<UpdateItemResponse>(`/items/${id}/update`, {
    method: 'PUT',
    body: data,
  })
}

export function deleteItem(id: string): Promise<void> {
  return request<void>(`/items/${id}/delete`, { method: 'DELETE' })
}
