/** Remove acentos e caixa: "José" → "jose". */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Quebra o texto em palavras, descartando pontuação.
 * "Mrs. Dennis Schulist" → ["mrs", "dennis", "schulist"]
 */
export function tokenize(text: string): string[] {
  return normalize(text).split(/[^a-z0-9]+/).filter(Boolean)
}
