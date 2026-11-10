/**
 * Distância de edição: quantas inserções, remoções ou trocas de letra
 * transformam `a` em `b`. "denis" → "dennis" = 1.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  // Só duas linhas da matriz ficam em memória.
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)

  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const substitution = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(
        previous[j] + 1, // remoção
        current[j - 1] + 1, // inserção
        previous[j - 1] + substitution, // troca
      )
    }
    previous = current
  }

  return previous[b.length]
}
