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

export function App() {
  const { state, retry } = useUsers()
  const [query, setQuery] = useState('')
  const [highlightedId, setHighlightedId] = useState<number | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const isWide = useMediaQuery('(min-width: 1024px)')
  const detailsTitleId = useId()

  const allUsers = state.status === 'success' ? state.users : EMPTY
  const visibleUsers = useMemo(() => searchUsersByName(allUsers, query), [allUsers, query])

  // Foco do globo: registro sob o mouse; senão, o único resultado da busca.
  const selectedPoints = useMemo(
    () => (selectedUser ? usersToGlobePoints([selectedUser]) : []),
    [selectedUser],
  )

  const focusedUser =
    visibleUsers.find((user) => user.id === highlightedId) ??
    (query && visibleUsers.length === 1 ? visibleUsers[0] : null)

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
            onHighlight={setHighlightedId}
          />
        </section>

        {isWide && <LocationPanel users={visibleUsers} focusedUser={focusedUser} />}
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
