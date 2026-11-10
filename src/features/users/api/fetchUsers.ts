import { getJson } from '../../../lib/http'
import type { User } from '../types/user'

export const USERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/users'

export function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  return getJson<User[]>(USERS_ENDPOINT, signal)
}
