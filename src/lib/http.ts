export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/**
 * Wrapper mínimo sobre fetch: lança erro em respostas não-2xx
 * (o fetch nativo só rejeita em falha de rede).
 */
export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } })

  if (!response.ok) {
    throw new HttpError(response.status, `Falha na requisição (HTTP ${response.status})`)
  }

  return (await response.json()) as T
}
