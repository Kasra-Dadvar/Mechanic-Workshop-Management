import { useEffect, useState } from 'react'
import { getCustomerVehicles } from '../../clients/customerClient'
import { getErrorMessage } from '../../clients/httpClient'
import type { Vehicle } from '../../models/vehicles/vehicle'

interface Result {
  id: string
  attempt: number
  vehicles?: Vehicle[]
  error?: string
}

export function useCustomerVehicles(customerId: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false

    getCustomerVehicles(customerId)
      .then((vehicles) => {
        if (!cancelled) setResult({ id: customerId, attempt, vehicles })
      })
      .catch((error) => {
        if (!cancelled) setResult({ id: customerId, attempt, error: getErrorMessage(error) })
      })

    return () => {
      cancelled = true
    }
  }, [customerId, attempt])

  // Loading is derived: a result only counts if it belongs to the current customer and attempt.
  const current =
    result?.id === customerId && result.attempt === attempt ? result : null

  return {
    vehicles: current?.vehicles ?? [],
    loading: current === null,
    error: current?.error ?? null,
    reload: () => setAttempt((value) => value + 1),
  }
}
