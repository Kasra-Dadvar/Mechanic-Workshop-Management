import type {
  CreateCustomerRequest,
  Customer,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
} from '../models/customers/customer'
import { request } from './httpClient'

export function getCustomers(): Promise<Customer[]> {
  return request<Customer[]>('/customers')
}

export function getCustomer(id: string): Promise<Customer> {
  return request<Customer>(`/customers/${id}`)
}

// The API responds with the new customer's id as a plain JSON string.
export function createCustomer(data: CreateCustomerRequest): Promise<string> {
  return request<string>('/customers', { method: 'POST', body: data })
}

export function updateCustomer(
  id: string,
  data: UpdateCustomerRequest,
): Promise<UpdateCustomerResponse> {
  return request<UpdateCustomerResponse>(`/customers/${id}/update`, {
    method: 'PUT',
    body: data,
  })
}

export function deleteCustomer(id: string): Promise<void> {
  return request<void>(`/customers/${id}/delete`, { method: 'DELETE' })
}
