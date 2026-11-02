export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  odometer: number
  licensePlate: string
  ownerName: string | null
  rego: string | null
}

export interface CreateVehicleRequest {
  make: string
  model: string
  year: number
  odometer: number
  licensePlate: string
  customerId: string
  rego: string | null
}

// Make, model, and year cannot be updated.
export interface UpdateVehicleRequest {
  odometer: number
  licensePlate: string
  rego: string | null
}

export interface UpdateVehicleResponse {
  odometer: number
  licensePlate: string
  customerId: string
  rego: string | null
}
