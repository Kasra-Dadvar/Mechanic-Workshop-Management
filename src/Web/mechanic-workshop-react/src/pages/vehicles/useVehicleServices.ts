import { useEffect, useState } from 'react'
import { getErrorMessage } from '../../clients/httpClient'
import { getVehicleServices } from '../../clients/vehicleClient'
import type { Service } from '../../models/services/service'

interface Result {
  id: string
  attempt: number
  services?: Service[]
  error?: string
}

export function useVehicleServices(vehicleId: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false

    getVehicleServices(vehicleId)
      .then((services) => {
        if (!cancelled) setResult({ id: vehicleId, attempt, services })
      })
      .catch((error) => {
        if (!cancelled) setResult({ id: vehicleId, attempt, error: getErrorMessage(error) })
      })

    return () => {
      cancelled = true
    }
  }, [vehicleId, attempt])

  // Loading is derived: a result only counts if it belongs to the current vehicle and attempt.
  const current = result?.id === vehicleId && result.attempt === attempt ? result : null

  return {
    services: current?.services ?? [],
    loading: current === null,
    error: current?.error ?? null,
    reload: () => setAttempt((value) => value + 1),
  }
}
