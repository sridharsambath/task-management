export function useApi() {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  function apiBase(): string {
    const base = config.public.apiBase as string
    return base.replace(/\/$/, '')
  }

  async function api<T>(
    path: string,
    options: {
      method?: string
      body?: unknown
      query?: Record<string, string>
    } = {}
  ): Promise<T> {
    const url = `${apiBase()}${path.startsWith('/') ? path : `/${path}`}`
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }
    return $fetch<T>(url, {
      ...options,
      headers: { ...headers, ...(options.headers as Record<string, string>) },
    })
  }

  return { api, apiBase }
}
