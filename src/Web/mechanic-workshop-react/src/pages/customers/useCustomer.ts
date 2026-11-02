import { useEffect, useState } from 'react'
import { getCustomer } from '../../clients/customerClient'
import { getErrorMessage } from '../../clients/httpClient'
import type { Customer } from '../../models/customers/customer'

interface Result {
  id: string
  attempt: number
  customer?: Customer
  error?: string
}

export function useCustomer(id: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false

    getCustomer(id)
      .then((customer) => {
        if (!cancelled) setResult({ id, attempt, customer })
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
    customer: current?.customer ?? null,
    loading: current === null,
    error: current?.error ?? null,
    reload: () => setAttempt((value) => value + 1),
  }
}
