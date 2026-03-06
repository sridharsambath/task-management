<template>
  <div class="mx-auto max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
    <h1 class="text-2xl font-bold text-gray-900">Create account</h1>
    <form class="space-y-6" @submit.prevent="onSubmit">
      <div v-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700">
        {{ error }}
      </div>
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          minlength="8"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm password</label>
        <input
          id="password_confirmation"
          v-model="passwordConfirmation"
          type="password"
          required
          minlength="8"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div class="flex items-center justify-between">
        <NuxtLink to="/login" class="text-sm text-indigo-600 hover:text-indigo-500">
          Already have an account?
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? 'Creating...' : 'Register' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { register } = useAuth()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await register(name.value, email.value, password.value, passwordConfirmation.value)
    await router.push('/projects')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string; errors?: Record<string, string[]> }; message?: string }
    if (err?.data?.errors) {
      error.value = Object.values(err.data.errors).flat().join(' ')
    } else {
      error.value = err?.data?.message || err?.message || 'Registration failed.'
    }
  } finally {
    loading.value = false
  }
}
</script>
