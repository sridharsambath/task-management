<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
    <div class="w-full max-w-md">
      <!-- Heading -->
      <div class="mb-8 text-center">
        <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 mb-4">
          <CheckSquare class="h-7 w-7 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-slate-900">Create your account</h1>
        <p class="mt-1 text-sm text-slate-500">Start managing your tasks with TaskFlow</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-xl shadow-slate-200/50 p-8">
        <form class="space-y-5" @submit.prevent="onSubmit">
          <!-- Error -->
          <div v-if="error" class="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-700">
            <AlertCircle class="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{{ error }}</span>
          </div>

          <!-- Name -->
          <div class="space-y-1.5">
            <label for="name" class="block text-sm font-medium text-slate-700">Full name</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <User class="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="name"
                v-model="name"
                type="text"
                required
                autocomplete="name"
                placeholder="Jane Smith"
                class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-1.5">
            <label for="email" class="block text-sm font-medium text-slate-700">Email address</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Mail class="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="you@example.com"
                class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock class="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="8"
                autocomplete="new-password"
                placeholder="Min. 8 characters"
                class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-1.5">
            <label for="password_confirmation" class="block text-sm font-medium text-slate-700">Confirm password</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <ShieldCheck class="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="password_confirmation"
                v-model="passwordConfirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                minlength="8"
                autocomplete="new-password"
                placeholder="Repeat your password"
                class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <Eye v-if="!showConfirmPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
            <span>{{ loading ? 'Creating account...' : 'Create account' }}</span>
            <ArrowRight v-if="!loading" class="h-4 w-4" />
          </button>
        </form>
      </div>

      <p class="mt-6 text-center text-sm text-slate-500">
        Already have an account?
        <NuxtLink to="/login" class="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckSquare, User, Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-vue-next'

definePageMeta({ layout: 'default' })

const { register } = useAuth()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
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
