import { describe, expect, it } from 'vitest'
import { usersFixture } from '../../../test/fixtures/users'
import { searchUsersByName } from './searchUsersByName'

const names = (query: string) => searchUsersByName(usersFixture, query).map((u) => u.name)

describe('searchUsersByName', () => {
  it('retorna todos, na ordem original, quando a busca está vazia', () => {
    expect(names('')).toEqual(usersFixture.map((u) => u.name))
    expect(names('  . ')).toHaveLength(usersFixture.length)
  })

  it('ignora maiúsculas e acentos', () => {
    expect(names('LEANNE')).toEqual(['Leanne Graham'])
    expect(names('jose')).toEqual(['José Mendes'])
    expect(names('Ervín')).toEqual(['Ervin Howell'])
  })

  it('ignora pontuação de pronomes de tratamento', () => {
    expect(names('mrs dennis')).toEqual(['Mrs. Dennis Schulist'])
    expect(names('Mrs. Dennis')).toEqual(['Mrs. Dennis Schulist'])
  })

  it('aceita as palavras em qualquer ordem e incompletas', () => {
    expect(names('schulist dennis')).toEqual(['Mrs. Dennis Schulist'])
    expect(names('den sch')).toEqual(['Mrs. Dennis Schulist'])
  })

  it('exige que todas as palavras da busca correspondam', () => {
    expect(names('dennis graham')).toEqual([])
  })

  it('tolera pequenos erros de digitação', () => {
    expect(names('denis')).toEqual(['Mrs. Dennis Schulist'])
    expect(names('schulst')).toEqual(['Mrs. Dennis Schulist'])
    expect(names('lenne graam')).toEqual(['Leanne Graham'])
  })

  it('não aplica tolerância em termos curtos', () => {
    expect(names('jse')).toEqual([])
  })

  it('ordena por relevância: início de palavra antes de trecho no meio', () => {
    // "e": Ervin começa com "e"; os demais só contêm a letra.
    expect(names('e')[0]).toBe('Ervin Howell')
  })

  it('não busca por email', () => {
    expect(names('april.biz')).toEqual([])
  })
})
