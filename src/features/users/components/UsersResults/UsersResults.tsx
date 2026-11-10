import { Button } from '../../../../components/Button'
import { StatusMessage } from '../../../../components/StatusMessage'
import type { UsersState } from '../../hooks/useUsers'
import type { User } from '../../types/user'
import { UserList } from '../UserList'
import { UserListSkeleton } from '../UserListSkeleton'

interface UsersResultsProps {
  state: UsersState
  /** Usuários já filtrados pela busca. */
  users: User[]
  query: string
  onRetry: () => void
  onSelect: (user: User) => void
  onHighlight?: (userId: number | null) => void
}

/** Decide o que mostrar para cada estado da requisição. */
export function UsersResults({ state, users, query, onRetry, onSelect, onHighlight }: UsersResultsProps) {
  if (state.status === 'loading') {
    return <UserListSkeleton />
  }

  if (state.status === 'error') {
    return (
      <StatusMessage
        tone="danger"
        code="ERRO"
        title="Não foi possível carregar os usuários"
        description={state.message}
        action={<Button onClick={onRetry}>Tentar novamente</Button>}
      />
    )
  }

  if (users.length === 0) {
    return (
      <StatusMessage
        code="0 RESULTADOS"
        title={`Nenhum usuário com “${query.trim()}” no nome`}
        description="Confira a grafia ou busque só pelo primeiro nome."
      />
    )
  }

  return <UserList users={users} onSelect={onSelect} onHighlight={onHighlight} />
}
