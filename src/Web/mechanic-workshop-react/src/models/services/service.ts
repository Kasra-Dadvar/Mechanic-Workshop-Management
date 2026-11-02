export interface Service {
  id: string
  name: string
  vehicleName: string | null
  cost: number
  servicedAt: string
  nextServiceDue: string
  nextOdometerDue: number
}

export interface CreateServiceRequest {
  name: string
  cost: number
  vehicleId: string
}

export interface UpdateServiceRequest {
  name: string
  cost: number
  servicedAt: string
  nextServiceDue: string
  nextOdometerDue: number
}

export interface UpdateServiceResponse {
  name: string | null
  cost: number
  servicedAt: string
  nextServiceDue: string
  nextOdometerDue: number
}
