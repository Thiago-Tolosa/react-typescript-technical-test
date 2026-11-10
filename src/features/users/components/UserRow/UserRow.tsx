import type { User } from '../../types/user'
import { getInitials } from '../../utils/getInitials'
import styles from './UserRow.module.css'

interface UserRowProps {
  user: User
  position: number
  onSelect: (user: User) => void
  /** Avisa quando o registro ganha (id) ou perde (null) destaque. */
  onHighlight?: (userId: number | null) => void
}

export function UserRow({ user, position, onSelect, onHighlight }: UserRowProps) {
  return (
    <button
      type="button"
      className={styles.row}
      onClick={() => onSelect(user)}
      onMouseEnter={() => onHighlight?.(user.id)}
      onMouseLeave={() => onHighlight?.(null)}
      onFocus={() => onHighlight?.(user.id)}
      onBlur={() => onHighlight?.(null)}
    >
      <span className={styles.position} aria-hidden="true">
        {String(position).padStart(2, '0')}
      </span>

      <span className={styles.avatar} aria-hidden="true">
        {getInitials(user.name)}
      </span>

      <span className={styles.identity}>
        <span className={styles.name}>{user.name}</span>
        <span className={styles.email}>{user.email}</span>
      </span>

      <span className={styles.meta}>
        <span className={styles.city}>{user.address.city}</span>
        <span className={styles.company}>{user.company.name}</span>
      </span>

      <svg className={styles.arrow} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 12 12 4M6 4h6v6" />
      </svg>
    </button>
  )
}
