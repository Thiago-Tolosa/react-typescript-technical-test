import { describe, expect, it } from 'vitest'
import { levenshtein } from './levenshtein'
import { matchCost } from './searchByText'
import { tokenize } from './tokenize'

describe('tokenize', () => {
  it('normaliza e separa por qualquer pontuação', () => {
    expect(tokenize('Mrs. Dennis Schulist')).toEqual(['mrs', 'dennis', 'schulist'])
    expect(tokenize('Romaguera-Crona')).toEqual(['romaguera', 'crona'])
    expect(tokenize('  José  ')).toEqual(['jose'])
  })
})

describe('levenshtein', () => {
  it('conta inserções, remoções e trocas', () => {
    expect(levenshtein('dennis', 'dennis')).toBe(0)
    expect(levenshtein('denis', 'dennis')).toBe(1)
    expect(levenshtein('kitten', 'sitting')).toBe(3)
    expect(levenshtein('', 'abc')).toBe(3)
  })
})

describe('matchCost', () => {
  it('dá custo menor para início de palavra do que para trecho ou erro', () => {
    const prefix = matchCost('den', 'Dennis')!
    const substring = matchCost('nnis', 'Dennis')!
    const typo = matchCost('denis', 'Dennis')

    expect(prefix).toBe(0)
    expect(prefix).toBeLessThan(substring)
    // "dennis" não começa nem contém "denis": só casa pela tolerância a erros.
    expect(typo).toBeGreaterThan(substring)
  })

  it('retorna null quando alguma palavra não corresponde', () => {
    expect(matchCost('dennis xyz', 'Mrs. Dennis Schulist')).toBeNull()
  })
})
