import { levenshtein } from './levenshtein'
import { tokenize } from './tokenize'

/** Custo de cada tipo de correspondência: quanto menor, mais relevante. */
const COST = {
  prefix: 0, // "den"    → "dennis"
  substring: 1, // "nnis"   → "dennis"
  typo: 2, // "denis"  → "dennis"
} as const

/** Palavras curtas não aceitam erro de digitação: "ana" ≈ "ava" geraria ruído. */
const MIN_LENGTH_FOR_TYPO = 4

function allowedTypos(term: string): number {
  if (term.length < MIN_LENGTH_FOR_TYPO) return 0
  return term.length >= 8 ? 2 : 1
}

/**
 * Compara o termo com o início da palavra (com uma letra a mais ou a menos),
 * para aceitar erro de digitação mesmo com a palavra ainda incompleta:
 * "schulst" ≈ "schulist", "denni" ≈ "dennis".
 */
function isTypoMatch(term: string, word: string): boolean {
  const limit = allowedTypos(term)
  if (limit === 0) return false

  for (let length = term.length - 1; length <= term.length + 1; length++) {
    if (levenshtein(term, word.slice(0, length)) <= limit) return true
  }
  return false
}

function termCost(term: string, words: string[]): number | null {
  let best: number | null = null

  for (const word of words) {
    if (word.startsWith(term)) return COST.prefix
    if (word.includes(term)) best = COST.substring
    else if (best === null && isTypoMatch(term, word)) best = COST.typo
  }

  return best
}

/**
 * Custo total de um texto para a busca, ou `null` se não corresponder.
 * Cada palavra da busca precisa casar com alguma palavra do texto, em qualquer ordem.
 */
export function matchCost(query: string, text: string): number | null {
  const terms = tokenize(query)
  const words = tokenize(text)
  let total = 0

  for (const term of terms) {
    const cost = termCost(term, words)
    if (cost === null) return null
    total += cost
  }

  return total
}

/**
 * Filtra e ordena por relevância. Empates mantêm a ordem original.
 * Busca vazia devolve a lista intacta.
 */
export function searchByText<T>(items: T[], query: string, getText: (item: T) => string): T[] {
  if (tokenize(query).length === 0) return items

  return items
    .map((item, index) => ({ item, index, cost: matchCost(query, getText(item)) }))
    .filter((entry): entry is typeof entry & { cost: number } => entry.cost !== null)
    .sort((a, b) => a.cost - b.cost || a.index - b.index)
    .map((entry) => entry.item)
}
