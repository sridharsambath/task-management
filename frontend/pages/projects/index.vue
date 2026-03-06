<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
      <button
        type="button"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        @click="showCreate = true"
      >
        New project
      </button>
    </div>

    <div v-if="loading" class="text-gray-500">Loading projects...</div>
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 text-red-700">{{ error }}</div>
    <ul v-else class="space-y-4">
      <li
        v-for="project in projects"
        :key="project.id"
        class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-indigo-300"
      >
        <NuxtLink :to="`/projects/${project.id}`" class="block">
          <h2 class="font-semibold text-gray-900">{{ project.name }}</h2>
          <p v-if="project.description" class="mt-1 text-sm text-gray-600">{{ project.description }}</p>
          <p class="mt-2 text-xs text-gray-500">
            {{ project.tasks?.length ?? 0 }} task(s)
          </p>
        </NuxtLink>
      </li>
      <li v-if="projects.length === 0" class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
        No projects yet. Create one to get started.
      </li>
    </ul>

    <!-- Create project modal -->
    <div
      v-if="showCreate"
      class="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
      @click.self="showCreate = false"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">New project</h2>
        <form class="mt-4 space-y-4" @submit.prevent="createProject">
          <div v-if="createError" class="rounded-md bg-red-50 p-2 text-sm text-red-700">{{ createError }}</div>
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              v-model="newName"
              type="text"
              required
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea
              id="description"
              v-model="newDescription"
              rows="2"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="showCreate = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ creating ? 'Creating...' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: number
  title: string
  status: string
  priority: string
}

interface Project {
  id: number
  name: string
  description: string | null
  tasks?: Task[]
}

const { api } = useApi()
const projects = ref<Project[]>([])
const loading = ref(true)
const error = ref('')
const showCreate = ref(false)
const newName = ref('')
const newDescription = ref('')
const creating = ref(false)
const createError = ref('')

async function loadProjects() {
  loading.value = true
  error.value = ''
  try {
    projects.value = await api<Project[]>('/api/projects')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; statusCode?: number }
    error.value = err?.data?.message || 'Failed to load projects.'
    if (err?.statusCode === 401) {
      const { logout } = useAuth()
      logout()
    }
  } finally {
    loading.value = false
  }
}

async function createProject() {
  createError.value = ''
  creating.value = true
  try {
    const created = await api<Project>('/api/projects', {
      method: 'POST',
      body: { name: newName.value, description: newDescription.value || null },
    })
    projects.value = [created, ...projects.value]
    showCreate.value = false
    newName.value = ''
    newDescription.value = ''
  } catch (e: unknown) {
    const err = e as { data?: { message?: string; errors?: Record<string, string[]> } }
    if (err?.data?.errors) {
      createError.value = Object.values(err.data.errors).flat().join(' ')
    } else {
      createError.value = err?.data?.message || 'Failed to create project.'
    }
  } finally {
    creating.value = false
  }
}

onMounted(loadProjects)
</script>
