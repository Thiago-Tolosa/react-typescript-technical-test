import type { User } from '../../types/user'
import { UserRow } from '../UserRow'
import styles from './UserList.module.css'

interface UserListProps {
  users: User[]
  onSelect: (user: User) => void
  onHighlight?: (userId: number | null) => void
}

export function UserList({ users, onSelect, onHighlight }: UserListProps) {
  return (
    <ul className={styles.list} aria-label="Usuários">
      {users.map((user) => (
        <li key={user.id} className={styles.item}>
          {/* A posição segue o id para não "renumerar" ao filtrar. */}
          <UserRow user={user} position={user.id} onSelect={onSelect} onHighlight={onHighlight} />
        </li>
      ))}
    </ul>
  )
}
