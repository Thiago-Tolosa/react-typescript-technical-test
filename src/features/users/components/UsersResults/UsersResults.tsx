import { Button } from '../../../../components/Button'
import { StatusMessage } from '../../../../components/StatusMessage'
import type { UsersState } from '../../hooks/useUsers'
import { UserList, type UserListProps } from '../UserList'
import { UserListSkeleton } from '../UserListSkeleton'

interface UsersResultsProps extends UserListProps {
  state: UsersState
  /** `users` herdado de UserListProps: já filtrados pela busca. */
  query: string
  onRetry: () => void
}

/** Decide o que mostrar para cada estado da requisição. */
export function UsersResults({ state, query, onRetry, ...listProps }: UsersResultsProps) {
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

  if (listProps.users.length === 0) {
    return (
      <StatusMessage
        code="0 RESULTADOS"
        title={`Nenhum usuário com “${query.trim()}” no nome`}
        description="Confira a grafia ou busque só pelo primeiro nome."
      />
    )
  }

  return <UserList {...listProps} />
}
