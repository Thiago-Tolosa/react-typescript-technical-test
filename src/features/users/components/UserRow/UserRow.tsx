import { useEffect, useRef } from 'react'
import { isFocusVisible } from '../../../../lib/dom/isFocusVisible'
import type { User } from '../../types/user'
import { getInitials } from '../../utils/getInitials'
import styles from './UserRow.module.css'

interface UserRowProps {
  user: User
  position: number
  onSelect: (user: User) => void
  /** Avisa quando o registro ganha (id) ou perde (null) destaque. */
  onHighlight?: (userId: number | null) => void
  /** Destaque vindo de fora da lista (ex.: hover no globo). */
  isHighlighted?: boolean
  /** Rola até a linha quando ela é destacada de fora. */
  revealWhenHighlighted?: boolean
}

export function UserRow({
  user,
  position,
  onSelect,
  onHighlight,
  isHighlighted = false,
  revealWhenHighlighted = false,
}: UserRowProps) {
  const rowRef = useRef<HTMLButtonElement>(null)
  /** Se o destaque atual veio do foco, para o blur só limpar o que ele mesmo criou. */
  const highlightedByFocusRef = useRef(false)

  useEffect(() => {
    if (isHighlighted && revealWhenHighlighted) {
      rowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [isHighlighted, revealWhenHighlighted])

  return (
    <button
      ref={rowRef}
      type="button"
      className={styles.row}
      data-highlighted={isHighlighted || undefined}
      onClick={() => onSelect(user)}
      onMouseEnter={() => onHighlight?.(user.id)}
      onMouseLeave={() => onHighlight?.(null)}
      onFocus={(event) => {
        // Só foco de teclado destaca. Ao fechar o modal com o mouse, o <dialog>
        // devolve o foco a esta linha; sem esse filtro, o destaque ficaria preso.
        if (!isFocusVisible(event.currentTarget)) return
        highlightedByFocusRef.current = true
        onHighlight?.(user.id)
      }}
      onBlur={() => {
        if (!highlightedByFocusRef.current) return
        highlightedByFocusRef.current = false
        onHighlight?.(null)
      }}
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
