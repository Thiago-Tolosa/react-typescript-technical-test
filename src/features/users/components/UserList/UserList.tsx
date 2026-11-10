import type { User } from '../../types/user'
import { UserRow } from '../UserRow'
import styles from './UserList.module.css'

export interface UserListProps {
  users: User[]
  onSelect: (user: User) => void
  onHighlight?: (userId: number | null) => void
  /** Linha destacada de fora da lista (ex.: hover no globo). */
  highlightedId?: number | null
  /** Rola até a linha destacada de fora. */
  revealHighlighted?: boolean
}

export function UserList({
  users,
  onSelect,
  onHighlight,
  highlightedId = null,
  revealHighlighted = false,
}: UserListProps) {
  return (
    <ul className={styles.list} aria-label="Usuários">
      {users.map((user) => (
        <li key={user.id} className={styles.item}>
          {/* A posição segue o id para não "renumerar" ao filtrar. */}
          <UserRow
            user={user}
            position={user.id}
            onSelect={onSelect}
            onHighlight={onHighlight}
            isHighlighted={user.id === highlightedId}
            revealWhenHighlighted={revealHighlighted}
          />
        </li>
      ))}
    </ul>
  )
}
