import { useEffect, useState } from 'react'
import { getErrorMessage } from '../../clients/httpClient'
import { getItem } from '../../clients/itemClient'
import type { Item } from '../../models/items/item'

interface Result {
  id: string
  attempt: number
  item?: Item
  error?: string
}

export function useItem(id: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false

    getItem(id)
      .then((item) => {
        if (!cancelled) setResult({ id, attempt, item })
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
    item: current?.item ?? null,
    loading: current === null,
    error: current?.error ?? null,
    reload: () => setAttempt((value) => value + 1),
  }
}
