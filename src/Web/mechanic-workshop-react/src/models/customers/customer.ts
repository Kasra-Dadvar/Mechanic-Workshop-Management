export interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
}

export interface CreateCustomerRequest {
  name: string
  email: string
  phone: string | null
}

export interface UpdateCustomerRequest {
  name: string
  email: string
  phone: string | null
}

export interface UpdateCustomerResponse {
  name: string | null
  email: string | null
  phone: string | null
}
