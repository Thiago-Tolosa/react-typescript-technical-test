const HONORIFICS = new Set(['mr.', 'mrs.', 'ms.', 'miss', 'dr.'])

/** "Mrs. Dennis Schulist" → "DS" (ignora pronomes de tratamento). */
export function getInitials(name: string): string {
  const parts = name
    .split(/\s+/)
    .filter((part) => part && !HONORIFICS.has(part.toLowerCase()))

  if (parts.length === 0) return '?'

  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}
