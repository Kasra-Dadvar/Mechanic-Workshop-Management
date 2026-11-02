import { useEffect, useState } from 'react'
import { getCustomers } from '../../clients/customerClient'
import { getErrorMessage } from '../../clients/httpClient'
import type { Customer } from '../../models/customers/customer'

interface Result {
  attempt: number
  customers?: Customer[]
  error?: string
}

export function useCustomers() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false

    getCustomers()
      .then((customers) => {
        if (!cancelled) setResult({ attempt, customers })
      })
      .catch((error) => {
        if (!cancelled) setResult({ attempt, error: getErrorMessage(error) })
      })

    return () => {
      cancelled = true
    }
  }, [attempt])

  // Loading is derived: a result only counts if it belongs to the current attempt.
  const current = result?.attempt === attempt ? result : null

  return {
    customers: current?.customers ?? [],
    loading: current === null,
    error: current?.error ?? null,
    reload: () => setAttempt((value) => value + 1),
  }
}
