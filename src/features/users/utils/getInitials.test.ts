import { describe, expect, it } from 'vitest'
import { getInitials } from './getInitials'

describe('getInitials', () => {
  it('usa a primeira e a última palavra', () => {
    expect(getInitials('Nicholas Runolfsdottir V')).toBe('NV')
  })

  it('ignora pronomes de tratamento', () => {
    expect(getInitials('Mrs. Dennis Schulist')).toBe('DS')
  })

  it('lida com nome único e vazio', () => {
    expect(getInitials('Cher')).toBe('C')
    expect(getInitials('  ')).toBe('?')
  })
})
