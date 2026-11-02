export interface Item {
  id: string
  name: string
  cost: number
  quantity: number
  serviceName: string | null
}

export interface CreateItemRequest {
  name: string
  cost: number
  quantity: number
  serviceId: string
}

export interface UpdateItemRequest {
  name: string
  cost: number
  quantity: number
}

export interface UpdateItemResponse {
  name: string | null
  cost: number
  quantity: number
}
