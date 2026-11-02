import { useEffect, useState } from 'react'
import { getErrorMessage } from '../../clients/httpClient'
import { getService } from '../../clients/serviceClient'
import type { Service } from '../../models/services/service'

interface Result {
  id: string
  attempt: number
  service?: Service
  error?: string
}

export function useService(id: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false

    getService(id)
      .then((service) => {
        if (!cancelled) setResult({ id, attempt, service })
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
    service: current?.service ?? null,
    loading: current === null,
    error: current?.error ?? null,
    reload: () => setAttempt((value) => value + 1),
  }
}
