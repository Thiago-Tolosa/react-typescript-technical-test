import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usersFixture } from '../test/fixtures/users'
import { App } from './App'

// WebGL não existe no jsdom; o globo é substituído por um marcador simples.
vi.mock('../features/globe', () => ({
  Globe: () => <div data-testid="globe" />,
}))

function mockFetchOnce(response: Partial<Response>) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response as Response)
}

const okResponse = { ok: true, status: 200, json: async () => usersFixture }

describe('App', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch')
  })

  it('mostra o estado de carregando e depois a lista com nome e email', async () => {
    mockFetchOnce(okResponse)
    render(<App />)

    expect(screen.getByText('Carregando usuários…')).toBeInTheDocument()

    const list = await screen.findByRole('list', { name: 'Usuários' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(usersFixture.length)
    expect(within(list).getByText('Leanne Graham')).toBeInTheDocument()
    expect(within(list).getByText('Sincere@april.biz')).toBeInTheDocument()
    expect(screen.queryByText('Carregando usuários…')).not.toBeInTheDocument()
  })

  it('filtra pelo nome e mostra mensagem quando não há resultados', async () => {
    const user = userEvent.setup()
    mockFetchOnce(okResponse)
    render(<App />)
    await screen.findByText('Leanne Graham')

    const search = screen.getByRole('searchbox', { name: 'Buscar usuário pelo nome' })
    await user.type(search, 'ervin')

    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'mrs dennis')
    expect(screen.getByText('Mrs. Dennis Schulist')).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'ninguém')
    expect(screen.getByText(/Nenhum usuário com/)).toBeInTheDocument()
  })

  it('abre o modal com os detalhes e fecha pelo botão', async () => {
    const user = userEvent.setup()
    mockFetchOnce(okResponse)
    render(<App />)

    await user.click(await screen.findByRole('button', { name: /Leanne Graham/ }))

    const dialog = screen.getByRole('dialog', { name: 'Leanne Graham' })
    expect(within(dialog).getByText('Sincere@april.biz')).toBeInTheDocument()
    expect(within(dialog).getByText('1-770-736-8031 x56442')).toBeInTheDocument()
    expect(within(dialog).getByText('Romaguera-Crona')).toBeInTheDocument()
    expect(within(dialog).getByText('Gwenborough')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Fechar detalhes' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mostra o erro e permite tentar novamente', async () => {
    const user = userEvent.setup()
    mockFetchOnce({ ok: false, status: 500 })
    render(<App />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Não foi possível carregar os usuários')
    expect(alert).toHaveTextContent('HTTP 500')

    mockFetchOnce(okResponse)
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    await waitFor(() => expect(screen.getByText('Leanne Graham')).toBeInTheDocument())
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
