import { useEffect, useState } from 'react'
import { getErrorMessage } from '../../clients/httpClient'
import { getVehicle } from '../../clients/vehicleClient'
import type { Vehicle } from '../../models/vehicles/vehicle'

interface Result {
  id: string
  attempt: number
  vehicle?: Vehicle
  error?: string
}

export function useVehicle(id: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false

    getVehicle(id)
      .then((vehicle) => {
        if (!cancelled) setResult({ id, attempt, vehicle })
      })
      .catch((error) => {
        if (!cancelled) setResult({ id, attempt, error: getErrorMessage(error) })
      })

    return () => {
      cancelled = true
    }
  }, [id, attempt])

  // Loading is derived: a result only counts if it belongs to the current id and attempt.
  const current = result?.id === id && result.attempt === attempt ? result : null

  return {
    vehicle: current?.vehicle ?? null,
    loading: current === null,
    error: current?.error ?? null,
    reload: () => setAttempt((value) => value + 1),
  }
}
