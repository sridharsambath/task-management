<template>
  <div class="min-h-screen bg-gray-50">
    <header v-if="isAuthenticated" class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <NuxtLink to="/projects" class="text-xl font-semibold text-gray-900">Task Management</NuxtLink>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">
            <span class="font-medium text-gray-500">Username:</span>
            {{ user ? (user.name || user.email || '—') : 'Loading...' }}
          </span>
          <button
            type="button"
            class="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, fetchUser, logout } = useAuth()
onMounted(() => {
  fetchUser()
})
</script>
