import { useId, useMemo, useState } from 'react'
import { Modal } from '../components/Modal'
import {
  searchUsersByName,
  UserDetails,
  UsersResults,
  UsersToolbar,
  useUsers,
  type User,
} from '../features/users'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usersToGlobePoints } from './mappers/usersToGlobePoints'
import { GlobeSlot } from './components/GlobeSlot'
import { LocationPanel } from './components/LocationPanel'
import styles from './App.module.css'

const EMPTY: User[] = []

/** De onde veio o destaque: muda o comportamento de cada lado. */
type Highlight = { userId: number; source: 'list' | 'globe' } | null

export function App() {
  const { state, retry } = useUsers()
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState<Highlight>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const isWide = useMediaQuery('(min-width: 1024px)')
  const detailsTitleId = useId()

  const allUsers = state.status === 'success' ? state.users : EMPTY
  const visibleUsers = useMemo(() => searchUsersByName(allUsers, query), [allUsers, query])

  const selectedPoints = useMemo(
    () => (selectedUser ? usersToGlobePoints([selectedUser]) : []),
    [selectedUser],
  )

  const highlightedUser = visibleUsers.find((user) => user.id === highlight?.userId) ?? null
  const singleResult = query && visibleUsers.length === 1 ? visibleUsers[0] : null

  // O globo só gira quando o destaque vem da lista (ou da busca).
  // Vindo do próprio globo, girar faria o ponto fugir do cursor.
  const globeFocusId =
    highlight?.source === 'list' ? highlight.userId : (singleResult?.id ?? null)

  // A lista só rola até a linha quando o destaque vem do globo.
  const listHighlightId = highlight?.source === 'globe' ? highlight.userId : null

  const highlightFrom = (source: 'list' | 'globe') => (userId: number | null) =>
    setHighlight(userId === null ? null : { userId, source })

  return (
    <div className={styles.shell}>
      <header className={styles.masthead}>
        <span className={styles.source}>GET jsonplaceholder.typicode.com/users</span>
        <h1 className={styles.title}>Diretório de usuários</h1>
      </header>

      <main className={styles.layout}>
        <section className={styles.directory} aria-label="Lista de usuários">
          <UsersToolbar
            query={query}
            onQueryChange={setQuery}
            visibleCount={state.status === 'success' ? visibleUsers.length : undefined}
            totalCount={state.status === 'success' ? allUsers.length : undefined}
          />
          <UsersResults
            state={state}
            users={visibleUsers}
            query={query}
            onRetry={retry}
            onSelect={setSelectedUser}
            onHighlight={highlightFrom('list')}
            highlightedId={listHighlightId}
            revealHighlighted
          />
        </section>

        {isWide && (
          <LocationPanel
            users={visibleUsers}
            highlightedUser={highlightedUser ?? singleResult}
            focusedId={globeFocusId}
            onPointHover={highlightFrom('globe')}
            onSelect={setSelectedUser}
          />
        )}
      </main>

      <Modal open={selectedUser !== null} onClose={() => setSelectedUser(null)} labelledBy={detailsTitleId}>
        {selectedUser && (
          <UserDetails
            user={selectedUser}
            titleId={detailsTitleId}
            onClose={() => setSelectedUser(null)}
            aside={
              <div className={styles.miniGlobe}>
                <GlobeSlot
                  points={selectedPoints}
                  focusedId={selectedUser.id}
                  autoRotate={false}
                />
              </div>
            }
          />
        )}
      </Modal>
    </div>
  )
}
