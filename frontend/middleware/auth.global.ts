export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  const publicPaths = ['/login', '/register']
  if (publicPaths.includes(to.path)) {
    if (isAuthenticated.value) {
      return navigateTo('/projects')
    }
    return
  }
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
