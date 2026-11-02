import { useEffect, useState } from 'react'
import { getErrorMessage } from '../../clients/httpClient'
import { getServiceItems } from '../../clients/serviceClient'
import type { Item } from '../../models/items/item'

interface Result {
  id: string
  attempt: number
  items?: Item[]
  error?: string
}

export function useServiceItems(serviceId: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false

    getServiceItems(serviceId)
      .then((items) => {
        if (!cancelled) setResult({ id: serviceId, attempt, items })
      })
      .catch((error) => {
        if (!cancelled) setResult({ id: serviceId, attempt, error: getErrorMessage(error) })
      })

    return () => {
      cancelled = true
    }
  }, [serviceId, attempt])

  // Loading is derived: a result only counts if it belongs to the current service and attempt.
  const current = result?.id === serviceId && result.attempt === attempt ? result : null

  return {
    items: current?.items ?? [],
    loading: current === null,
    error: current?.error ?? null,
    reload: () => setAttempt((value) => value + 1),
  }
}
