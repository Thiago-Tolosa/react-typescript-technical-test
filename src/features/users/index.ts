// API pública da feature: o resto do app importa só daqui.
export { UserDetails } from './components/UserDetails'
export { UsersResults } from './components/UsersResults'
export { UsersToolbar } from './components/UsersToolbar'
export { useUsers } from './hooks/useUsers'
export type { UsersState } from './hooks/useUsers'
export type { User } from './types/user'
export { searchUsersByName } from './utils/searchUsersByName'
export { formatCoordinates } from './utils/formatCoordinates'
