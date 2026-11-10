import { SearchField } from '../../../../components/SearchField'
import styles from './UsersToolbar.module.css'

interface UsersToolbarProps {
  query: string
  onQueryChange: (query: string) => void
  /** Ausentes enquanto os dados carregam. */
  visibleCount?: number
  totalCount?: number
}

const pad = (n: number) => String(n).padStart(2, '0')

export function UsersToolbar({ query, onQueryChange, visibleCount, totalCount }: UsersToolbarProps) {
  const hasCounts = visibleCount !== undefined && totalCount !== undefined

  return (
    <div className={styles.toolbar}>
      <SearchField
        label="Buscar usuário pelo nome"
        placeholder="Buscar pelo nome"
        value={query}
        onChange={onQueryChange}
        shortcut="/"
      />
      <output className={styles.count} aria-live="polite">
        {hasCounts ? (
          <>
            <span className={styles.visible}>{pad(visibleCount)}</span>
            <span className={styles.total}> / {pad(totalCount)}</span>
          </>
        ) : (
          <span className={styles.total}>-- / --</span>
        )}
      </output>
    </div>
  )
}
