import { useMemo } from 'react'
import { formatCoordinates, type User } from '../../../features/users'
import { usersToGlobePoints } from '../../mappers/usersToGlobePoints'
import { GlobeSlot } from '../GlobeSlot'
import styles from './LocationPanel.module.css'

interface LocationPanelProps {
  users: User[]
  /** Usuário destacado (pela lista ou pelo globo). */
  highlightedUser: User | null
  /** Usuário até o qual o globo deve girar. */
  focusedId: number | null
  onPointHover: (userId: number | null) => void
  onSelect: (user: User) => void
}

/** Painel lateral: globo com os usuários visíveis + leitura do usuário em destaque. */
export function LocationPanel({
  users,
  highlightedUser,
  focusedId,
  onPointHover,
  onSelect,
}: LocationPanelProps) {
  const points = useMemo(() => usersToGlobePoints(users), [users])

  function handlePointSelect(userId: number) {
    const user = users.find((candidate) => candidate.id === userId)
    if (user) onSelect(user)
  }

  return (
    <aside className={styles.panel} aria-label="Localização dos usuários">
      <header className={styles.header}>
        <span>Localização</span>
        <span className={styles.faint}>{String(points.length).padStart(2, '0')} pontos</span>
      </header>

      <div className={styles.viewport}>
        <GlobeSlot
          points={points}
          focusedId={focusedId}
          highlightedId={highlightedUser?.id ?? null}
          highlightedLabel={highlightedUser?.address.city}
          onPointHover={onPointHover}
          onPointSelect={handlePointSelect}
        />
      </div>

      <footer className={styles.readout} aria-live="polite">
        {highlightedUser ? (
          <>
            <span className={styles.readoutName}>{highlightedUser.name}</span>
            <span className={styles.readoutMeta}>
              {highlightedUser.address.city} · {formatCoordinates(highlightedUser.address.geo)}
            </span>
          </>
        ) : (
          <span className={styles.faint}>
            Passe o mouse sobre um registro ou ponto. Clique para ver detalhes, arraste para girar.
          </span>
        )}
      </footer>

      <p className={styles.note}>As coordenadas da API são fictícias, por isso muitos pontos caem no oceano.</p>
    </aside>
  )
}
