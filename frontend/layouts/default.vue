<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <header v-if="isAuthenticated" class="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <NuxtLink to="/projects" class="flex items-center gap-2.5 group">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md group-hover:shadow-indigo-200 transition-shadow">
              <CheckSquare class="h-4 w-4 text-white" />
            </div>
            <span class="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </NuxtLink>

          <div class="flex items-center gap-3">
            <div class="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <div class="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                <span class="text-xs font-bold text-white">{{ userInitial }}</span>
              </div>
              <span class="text-sm font-medium text-slate-700">{{ user ? (user.name || user.email || '—') : 'Loading...' }}</span>
            </div>
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
              @click="logout"
            >
              <LogOut class="h-3.5 w-3.5" />
              <span class="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { CheckSquare, LogOut } from 'lucide-vue-next'

const { user, isAuthenticated, fetchUser, logout } = useAuth()

const userInitial = computed(() => {
  if (!user.value) return '?'
  const name = user.value.name || user.value.email || ''
  return name.charAt(0).toUpperCase()
})

onMounted(() => {
  fetchUser()
})
</script>
