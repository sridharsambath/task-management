<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
    </div>

    <!-- New project block -->
    <div class="mb-6">
      <button
        type="button"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        @click="showCreate = true"
      >
        New project
      </button>
    </div>

    <!-- Filters block -->
    <div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 class="mb-3 text-sm font-medium text-gray-700">Filters</h3>
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-xs text-gray-500">Search</label>
          <input
            v-model="searchInput"
            type="search"
            placeholder="Search by name or description..."
            class="max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs text-gray-500">Sort</label>
          <select
            v-model="sort"
            class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="updated_at">Newest first</option>
            <option value="updated_at_asc">Oldest first</option>
            <option value="name">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="created_at">Created (newest)</option>
            <option value="created_at_asc">Created (oldest)</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            @click="applyProjectFilters"
          >
            Filter
          </button>
          <button
            type="button"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            @click="resetProjectFilters"
          >
            Reset filter
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-gray-500">Loading projects...</div>
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 text-red-700">{{ error }}</div>
    <template v-else>
      <ul class="space-y-4">
        <li
          v-for="project in projects"
          :key="project.id"
          class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-indigo-300"
        >
          <NuxtLink :to="`/projects/${project.id}`" class="block">
            <h2 class="font-semibold text-gray-900">{{ project.name }}</h2>
            <p v-if="project.description" class="mt-1 text-sm text-gray-600">{{ project.description }}</p>
            <p class="mt-2 text-xs text-gray-500">
              {{ project.tasks_count ?? project.tasks?.length ?? 0 }} task(s)
            </p>
          </NuxtLink>
        </li>
        <li v-if="projects.length === 0" class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
          {{ searchInput || sort !== 'updated_at' ? 'No projects match your filters.' : 'No projects yet. Create one to get started.' }}
        </li>
      </ul>

      <div v-if="meta && meta.last_page > 1" class="mt-6 flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm text-gray-600">
          Showing {{ meta.from ?? 0 }}–{{ meta.to ?? 0 }} of {{ meta.total }}
        </p>
        <div class="flex gap-1">
          <button
            type="button"
            class="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            :disabled="meta.current_page <= 1"
            @click="goToProjectPage(meta.current_page - 1)"
          >
            Previous
          </button>
          <span class="flex items-center px-2 text-sm text-gray-600">
            Page {{ meta.current_page }} of {{ meta.last_page }}
          </span>
          <button
            type="button"
            class="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            :disabled="meta.current_page >= meta.last_page"
            @click="goToProjectPage(meta.current_page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </template>

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
  tasks_count?: number
  tasks?: Task[]
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number
  to?: number
}

const route = useRoute()
const router = useRouter()
const { api } = useApi()
const projects = ref<Project[]>([])
const meta = ref<PaginationMeta | null>(null)
const loading = ref(true)
const error = ref('')
const showCreate = ref(false)
const newName = ref('')
const newDescription = ref('')
const creating = ref(false)
const createError = ref('')

const searchInput = ref('')
const sort = ref('updated_at')
const page = ref(1)
const perPage = ref(10)

function initProjectFiltersFromQuery() {
  const q = route.query
  searchInput.value = (q.search as string) ?? ''
  sort.value = (q.sort as string) || 'updated_at'
  page.value = Math.max(1, parseInt((q.page as string) || '1', 10) || 1)
}

function getProjectQuery() {
  const q: Record<string, string> = {}
  if (searchInput.value) q.search = searchInput.value
  if (sort.value !== 'updated_at') q.sort = sort.value
  if (page.value > 1) q.page = String(page.value)
  return q
}

function applyProjectFilters() {
  page.value = 1
  router.replace({ path: route.path, query: getProjectQuery() })
}

function resetProjectFilters() {
  searchInput.value = ''
  sort.value = 'updated_at'
  page.value = 1
  router.replace({ path: route.path, query: {} })
}

function goToProjectPage(newPage: number) {
  page.value = newPage
  router.replace({ path: route.path, query: getProjectQuery() })
}

async function loadProjects() {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams()
    if (searchInput.value) params.set('search', searchInput.value)
    params.set('sort', sort.value)
    params.set('page', String(page.value))
    params.set('per_page', String(perPage.value))
    const res = await api<{ data: Project[]; meta: PaginationMeta }>(`/api/projects?${params.toString()}`)
    if (res && typeof res === 'object' && 'data' in res) {
      projects.value = (res as { data: Project[] }).data
      meta.value = (res as { meta: PaginationMeta }).meta ?? null
    } else {
      projects.value = Array.isArray(res) ? res as unknown as Project[] : []
      meta.value = null
    }
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
    await api<Project>('/api/projects', {
      method: 'POST',
      body: { name: newName.value, description: newDescription.value || null },
    })
    showCreate.value = false
    newName.value = ''
    newDescription.value = ''
    page.value = 1
    router.replace({ path: route.path, query: getProjectQuery() })
    await loadProjects()
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

watch(() => route.query, () => {
  initProjectFiltersFromQuery()
  loadProjects()
}, { deep: true, immediate: true })
</script>
