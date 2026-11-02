import type {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  UpdateVehicleResponse,
  Vehicle,
} from '../models/vehicles/vehicle'
import { request } from './httpClient'
import type { Service } from '../models/services/service'

export function getVehicle(id: string): Promise<Vehicle> {
  return request<Vehicle>(`/vehicles/${id}`)
}

export function getVehicleServices(id: string): Promise<Service[]> {
  return request<Service[]>(`/vehicles/${id}/services`)
}

// The API responds with the new vehicle's id as a plain JSON string.
export function createVehicle(data: CreateVehicleRequest): Promise<string> {
  return request<string>('/vehicles', { method: 'POST', body: data })
}

export function updateVehicle(
  id: string,
  data: UpdateVehicleRequest,
): Promise<UpdateVehicleResponse> {
  return request<UpdateVehicleResponse>(`/vehicles/${id}/update`, {
    method: 'PUT',
    body: data,
  })
}

export function deleteVehicle(id: string): Promise<void> {
  return request<void>(`/vehicles/${id}/delete`, { method: 'DELETE' })
}
