import { useCallback, useEffect, useState } from 'react'
import { fetchUsers } from '../api/fetchUsers'
import type { User } from '../types/user'

/** União discriminada: impossível ter `users` e `error` ao mesmo tempo. */
export type UsersState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; users: User[] }

interface UseUsersResult {
  state: UsersState
  retry: () => void
}

export function useUsers(): UseUsersResult {
  const [state, setState] = useState<UsersState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetchUsers(controller.signal)
      .then((users) => setState({ status: 'success', users }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Erro desconhecido'
        setState({ status: 'error', message })
      })

    // Cancela a requisição se o componente desmontar ou houver nova tentativa.
    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  return { state, retry }
}
