import { useMemo } from 'react'
import { formatCoordinates, type User } from '../../../features/users'
import { usersToGlobePoints } from '../../mappers/usersToGlobePoints'
import { GlobeSlot } from '../GlobeSlot'
import styles from './LocationPanel.module.css'

interface LocationPanelProps {
  users: User[]
  focusedUser: User | null
}

/** Painel lateral: globo com todos os usuários visíveis + leitura do usuário em foco. */
export function LocationPanel({ users, focusedUser }: LocationPanelProps) {
  const points = useMemo(() => usersToGlobePoints(users), [users])

  return (
    <aside className={styles.panel} aria-label="Localização dos usuários">
      <header className={styles.header}>
        <span>Localização</span>
        <span className={styles.faint}>{String(points.length).padStart(2, '0')} pontos</span>
      </header>

      <div className={styles.viewport}>
        <GlobeSlot
          points={points}
          focusedId={focusedUser?.id ?? null}
          focusedLabel={focusedUser?.address.city}
        />
      </div>

      <footer className={styles.readout} aria-live="polite">
        {focusedUser ? (
          <>
            <span className={styles.readoutName}>{focusedUser.name}</span>
            <span className={styles.readoutMeta}>
              {focusedUser.address.city} · {formatCoordinates(focusedUser.address.geo)}
            </span>
          </>
        ) : (
          <span className={styles.faint}>Passe o mouse sobre um registro para localizá-lo.</span>
        )}
      </footer>

      <p className={styles.note}>As coordenadas da API são fictícias, por isso muitos pontos caem no oceano.</p>
    </aside>
  )
}
