<template>
  <div>
    <!-- Page header -->
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Projects</h1>
        <p class="mt-1 text-sm text-slate-500">Manage and track all your projects in one place</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all"
        @click="showCreate = true"
      >
        <Plus class="h-4 w-4" />
        New project
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm p-4">
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex-1 min-w-[200px]">
          <label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide">Search</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search class="h-4 w-4 text-slate-400" />
            </div>
            <input
              v-model="searchInput"
              type="search"
              placeholder="Search by name or description..."
              class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
            />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide">Sort by</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <ArrowUpDown class="h-3.5 w-3.5 text-slate-400" />
            </div>
            <select
              v-model="sort"
              class="appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-8 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
            >
              <option value="updated_at">Newest first</option>
              <option value="updated_at_asc">Oldest first</option>
              <option value="name">Name A–Z</option>
              <option value="name_desc">Name Z–A</option>
              <option value="created_at">Created (newest)</option>
              <option value="created_at_asc">Created (oldest)</option>
            </select>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            @click="applyProjectFilters"
          >
            <Filter class="h-3.5 w-3.5" />
            Apply
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            @click="resetProjectFilters"
          >
            <X class="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl bg-white/60 border border-slate-100 p-6 h-40" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 p-5 text-red-700">
      <AlertCircle class="h-5 w-5 mt-0.5 flex-shrink-0" />
      <p>{{ error }}</p>
    </div>

    <template v-else>
      <!-- Project Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="project in projects"
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="group relative flex flex-col rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-6"
        >
          <div class="mb-3 flex items-start justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 group-hover:from-indigo-200 group-hover:to-violet-200 transition-colors">
              <FolderOpen class="h-5 w-5 text-indigo-600" />
            </div>
            <ChevronRight class="h-4 w-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all mt-1" />
          </div>

          <h2 class="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1">
            {{ project.name }}
          </h2>
          <p v-if="project.description" class="mt-1 text-sm text-slate-500 line-clamp-2">
            {{ project.description }}
          </p>
          <p v-else class="mt-1 text-sm text-slate-400 italic">No description</p>

          <div class="mt-auto pt-4 flex items-center gap-1.5">
            <ListChecks class="h-3.5 w-3.5 text-slate-400" />
            <span class="text-xs text-slate-500 font-medium">
              {{ project.tasks_count ?? project.tasks?.length ?? 0 }} task{{ (project.tasks_count ?? project.tasks?.length ?? 0) === 1 ? '' : 's' }}
            </span>
          </div>
        </NuxtLink>

        <!-- Empty state -->
        <div
          v-if="projects.length === 0"
          class="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center"
        >
          <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <FolderOpen class="h-8 w-8 text-slate-400" />
          </div>
          <h3 class="text-base font-semibold text-slate-700">
            {{ searchInput || sort !== 'updated_at' ? 'No matching projects' : 'No projects yet' }}
          </h3>
          <p class="mt-1 text-sm text-slate-500">
            {{ searchInput || sort !== 'updated_at' ? 'Try adjusting your filters.' : 'Create your first project to get started.' }}
          </p>
          <button
            v-if="!searchInput && sort === 'updated_at'"
            type="button"
            class="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            @click="showCreate = true"
          >
            <Plus class="h-4 w-4" />
            New project
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta && meta.last_page > 1" class="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-slate-500">
          Showing <span class="font-medium text-slate-700">{{ meta.from ?? 0 }}–{{ meta.to ?? 0 }}</span> of <span class="font-medium text-slate-700">{{ meta.total }}</span> projects
        </p>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            :disabled="meta.current_page <= 1"
            @click="goToProjectPage(meta.current_page - 1)"
          >
            <ChevronLeft class="h-4 w-4" />
            Previous
          </button>
          <span class="px-3 py-1.5 text-sm text-slate-500">
            {{ meta.current_page }} / {{ meta.last_page }}
          </span>
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            :disabled="meta.current_page >= meta.last_page"
            @click="goToProjectPage(meta.current_page + 1)"
          >
            Next
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </template>

    <!-- Create project modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showCreate"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showCreate = false"
        >
          <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showCreate = false" />
          <div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-slate-900/20">
            <div class="border-b border-slate-100 p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                    <FolderPlus class="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 class="text-lg font-semibold text-slate-900">New project</h2>
                </div>
                <button type="button" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" @click="showCreate = false">
                  <X class="h-5 w-5" />
                </button>
              </div>
            </div>
            <form class="p-6 space-y-4" @submit.prevent="createProject">
              <div v-if="createError" class="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
                <AlertCircle class="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{{ createError }}</span>
              </div>
              <div class="space-y-1.5">
                <label for="name" class="block text-sm font-medium text-slate-700">Project name <span class="text-red-400">*</span></label>
                <input
                  id="name"
                  v-model="newName"
                  type="text"
                  required
                  placeholder="e.g. Website Redesign"
                  class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
                />
              </div>
              <div class="space-y-1.5">
                <label for="description" class="block text-sm font-medium text-slate-700">Description <span class="text-slate-400 font-normal">(optional)</span></label>
                <textarea
                  id="description"
                  v-model="newDescription"
                  rows="3"
                  placeholder="What is this project about?"
                  class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors resize-none"
                />
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  @click="showCreate = false"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="creating"
                  class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-600 hover:to-violet-700 disabled:opacity-60 transition-all"
                >
                  <Loader2 v-if="creating" class="h-3.5 w-3.5 animate-spin" />
                  {{ creating ? 'Creating...' : 'Create project' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  Plus, Search, Filter, X, ArrowUpDown, FolderOpen, FolderPlus, ChevronRight, ChevronLeft,
  ListChecks, AlertCircle, Loader2,
} from 'lucide-vue-next'

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
const perPage = ref(12)

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

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
