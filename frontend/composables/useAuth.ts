const AUTH_TOKEN_KEY = 'auth_token'

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export function useAuth() {
  const tokenCookie = useCookie<string | null>(AUTH_TOKEN_KEY, { maxAge: 60 * 60 * 24 * 7 })
  const token = useState<string | null>(AUTH_TOKEN_KEY, () => tokenCookie.value)
  const user = useState<User | null>('auth_user', () => null)

  watch(token, (v) => {
    tokenCookie.value = v
  }, { immediate: true })
  const config = useRuntimeConfig()
  const router = useRouter()

  const apiBase = () => (config.public.apiBase as string).replace(/\/$/, '')

  async function fetchUser() {
    if (!token.value) {
      user.value = null
      return
    }
    try {
      const u = await $fetch<User>(`${apiBase()}/api/user`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = u
    } catch {
      token.value = null
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    const res = await $fetch<{ token: string; user: User }>(`${apiBase()}/api/login`, {
      method: 'POST',
      body: { email, password },
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    })
    token.value = res.token
    user.value = res.user
  }

  async function register(name: string, email: string, password: string, password_confirmation: string) {
    const res = await $fetch<{ token: string; user: User }>(`${apiBase()}/api/register`, {
      method: 'POST',
      body: { name, email, password, password_confirmation },
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    })
    token.value = res.token
    user.value = res.user
  }

  function logout() {
    token.value = null
    user.value = null
    router.push('/login')
  }

  const isAuthenticated = computed(() => !!token.value)

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  }
}
