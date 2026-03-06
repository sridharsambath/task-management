export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth()
  return navigateTo(isAuthenticated.value ? '/projects' : '/login', { replace: true })
})
