import { searchByText } from '../../../lib/search'
import type { User } from '../types/user'

/**
 * Busca tolerante pelo nome: ignora pontuação, acentos, ordem das palavras
 * e pequenos erros de digitação. Resultados mais relevantes vêm primeiro.
 *
 * "mrs dennis", "dennis mrs" e "denis schul" encontram "Mrs. Dennis Schulist".
 */
export function searchUsersByName(users: User[], query: string): User[] {
  return searchByText(users, query, (user) => user.name)
}
