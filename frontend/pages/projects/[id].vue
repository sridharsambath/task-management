<template>
  <div>
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 text-red-700">{{ error }}</div>
    <template v-else-if="project">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <NuxtLink to="/projects" class="text-sm text-indigo-600 hover:text-indigo-500">&larr; Projects</NuxtLink>
          <h1 class="mt-1 text-2xl font-bold text-gray-900">{{ project.name }}</h1>
          <p v-if="project.description" class="mt-1 text-gray-600">{{ project.description }}</p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="showEdit = true"
          >
            Edit
          </button>
          <button
            type="button"
            class="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            @click="showDeleteProjectModal = true"
          >
            Delete
          </button>
        </div>
      </div>

      <hr class="my-8 border-gray-200" />

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">Tasks</h2>

        <!-- Add task block -->
        <div class="mb-6">
          <button
            type="button"
            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            @click="showAddTask = true"
          >
            Add task
          </button>
        </div>

        <!-- Filters block -->
        <div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 class="mb-3 text-sm font-medium text-gray-700">Filters</h3>
          <div class="flex flex-wrap items-end gap-3">
            <input
              v-model="taskSearchInput"
              type="search"
              placeholder="Search tasks..."
              class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500">Status</label>
              <select
                v-model="taskStatusFilter"
                class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">All statuses</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500">Priority</label>
              <select
                v-model="taskPriorityFilter"
                class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500">Sort</label>
              <select
                v-model="taskSort"
                class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="created_at">Newest first</option>
                <option value="created_at_asc">Oldest first</option>
                <option value="title">Title A–Z</option>
                <option value="title_desc">Title Z–A</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="due_date">Due date (latest)</option>
                <option value="due_date_asc">Due date (earliest)</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500">From date</label>
              <input
                v-model="taskDateFrom"
                type="date"
                class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500">To date</label>
              <input
                v-model="taskDateTo"
                type="date"
                class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                @click="applyTaskFilters"
              >
                Filter
              </button>
              <button
                type="button"
                class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                @click="resetTaskFilters"
              >
                Reset filter
              </button>
            </div>
          </div>
        </div>
        <div v-if="tasksLoading" class="text-gray-500">Loading tasks...</div>
        <template v-else>
          <ul class="space-y-3">
            <li
              v-for="task in tasks"
              :key="task.id"
              class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div>
                <span class="font-medium text-gray-900">{{ task.title }}</span>
                <span class="ml-2 rounded px-2 py-0.5 text-xs" :class="statusClass(task.status)">{{ task.status }}</span>
                <span class="ml-2 rounded px-2 py-0.5 text-xs" :class="priorityClass(task.priority)">{{ task.priority }}</span>
                <p v-if="task.description" class="mt-1 text-sm text-gray-600">{{ task.description }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="text-sm text-indigo-600 hover:text-indigo-500"
                  @click="viewingTask = { ...task }"
                >
                  View
                </button>
                <button
                  type="button"
                  class="text-sm text-indigo-600 hover:text-indigo-500"
                  @click="openEditTask(task)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="text-sm text-red-600 hover:text-red-500"
                  @click="taskToDelete = task.id"
                >
                  Delete
                </button>
              </div>
            </li>
            <li v-if="tasks.length === 0" class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
              {{ taskSearchInput || taskStatusFilter || taskPriorityFilter || taskDateFrom || taskDateTo ? 'No tasks match your search or filters.' : 'No tasks. Add one above.' }}
            </li>
          </ul>
          <div v-if="tasksMeta && tasksMeta.last_page > 1" class="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm text-gray-600">
              Showing {{ tasksMeta.from ?? 0 }}–{{ tasksMeta.to ?? 0 }} of {{ tasksMeta.total }}
            </p>
            <div class="flex gap-1">
              <button
                type="button"
                class="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                :disabled="tasksMeta.current_page <= 1"
                @click="goToTaskPage(tasksMeta.current_page - 1)"
              >
                Previous
              </button>
              <span class="flex items-center px-2 text-sm text-gray-600">
                Page {{ tasksMeta.current_page }} of {{ tasksMeta.last_page }}
              </span>
              <button
                type="button"
                class="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                :disabled="tasksMeta.current_page >= tasksMeta.last_page"
                @click="goToTaskPage(tasksMeta.current_page + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </template>
      </section>

      <!-- Edit project modal -->
      <div
        v-if="showEdit"
        class="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
        @click.self="showEdit = false"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 class="text-lg font-semibold text-gray-900">Edit project</h2>
          <form class="mt-4 space-y-4" @submit.prevent="updateProject">
            <div v-if="editError" class="rounded-md bg-red-50 p-2 text-sm text-red-700">{{ editError }}</div>
            <div>
              <label for="edit-name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="edit-name"
                v-model="editName"
                type="text"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label for="edit-description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="edit-description"
                v-model="editDescription"
                rows="2"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" class="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50" @click="showEdit = false">Cancel</button>
              <button type="submit" :disabled="saving" class="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50">Save</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add task modal -->
      <div
        v-if="showAddTask"
        class="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
        @click.self="showAddTask = false"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 class="text-lg font-semibold text-gray-900">Add task</h2>
          <TaskForm
            :project-id="projectId"
            @saved="onTaskSaved"
            @cancel="showAddTask = false"
          />
        </div>
      </div>

      <!-- Edit task modal -->
      <div
        v-if="editingTask"
        class="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
        @click.self="editingTask = null"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 class="text-lg font-semibold text-gray-900">Edit task</h2>
          <TaskForm
            :project-id="projectId"
            :task="editingTask"
            @saved="onTaskUpdated"
            @cancel="editingTask = null"
          />
        </div>
      </div>

      <!-- Delete project modal -->
      <ConfirmModal
        v-if="showDeleteProjectModal"
        title="Delete project"
        message="Delete this project and all its tasks? This cannot be undone."
        confirm-label="Delete"
        :loading="deletingProject"
        @confirm="doDeleteProject"
        @cancel="showDeleteProjectModal = false"
      />

      <!-- View task modal -->
      <div
        v-if="viewingTask"
        class="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
        @click.self="viewingTask = null"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 class="text-lg font-semibold text-gray-900">Task details</h2>
          <dl class="mt-4 space-y-3">
            <div>
              <dt class="text-xs font-medium uppercase text-gray-500">Title</dt>
              <dd class="mt-0.5 font-medium text-gray-900">{{ viewingTask.title }}</dd>
            </div>
            <div v-if="viewingTask.description">
              <dt class="text-xs font-medium uppercase text-gray-500">Description</dt>
              <dd class="mt-0.5 text-sm text-gray-700 whitespace-pre-wrap">{{ viewingTask.description }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase text-gray-500">Status</dt>
              <dd class="mt-0.5">
                <span class="rounded px-2 py-0.5 text-xs" :class="statusClass(viewingTask.status)">{{ viewingTask.status }}</span>
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase text-gray-500">Priority</dt>
              <dd class="mt-0.5">
                <span class="rounded px-2 py-0.5 text-xs" :class="priorityClass(viewingTask.priority)">{{ viewingTask.priority }}</span>
              </dd>
            </div>
            <div v-if="viewingTask.due_date">
              <dt class="text-xs font-medium uppercase text-gray-500">Due date</dt>
              <dd class="mt-0.5 text-sm text-gray-700">{{ formatDueDate(viewingTask.due_date) }}</dd>
            </div>
          </dl>
          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="viewingTask = null"
            >
              Close
            </button>
            <button
              type="button"
              class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              @click="openEditFromView()"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Delete task modal -->
      <ConfirmModal
        v-if="taskToDelete !== null"
        title="Delete task"
        message="Delete this task? This cannot be undone."
        confirm-label="Delete"
        :loading="deletingTask"
        @confirm="doDeleteTask"
        @cancel="taskToDelete = null"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
}

interface Project {
  id: number
  name: string
  description: string | null
  tasks?: Task[]
}

interface TasksMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number
  to?: number
}

const route = useRoute()
const router = useRouter()
const projectId = computed(() => Number(route.params.id))
const { api } = useApi()
const project = ref<Project | null>(null)
const loading = ref(true)
const error = ref('')
const showEdit = ref(false)
const editName = ref('')
const editDescription = ref('')
const editError = ref('')
const saving = ref(false)
const showAddTask = ref(false)
const viewingTask = ref<Task | null>(null)
const editingTask = ref<Task | null>(null)
const showDeleteProjectModal = ref(false)
const deletingProject = ref(false)
const taskToDelete = ref<number | null>(null)
const deletingTask = ref(false)

const tasks = ref<Task[]>([])
const tasksMeta = ref<TasksMeta | null>(null)
const tasksLoading = ref(false)
const taskSearchInput = ref('')
const taskStatusFilter = ref('')
const taskPriorityFilter = ref('')
const taskDateFrom = ref('')
const taskDateTo = ref('')
const taskSort = ref('created_at')
const taskPage = ref(1)
const taskPerPage = ref(10)

function statusClass(s: string) {
  const map: Record<string, string> = {
    todo: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
  }
  return map[s] || 'bg-gray-100 text-gray-700'
}

function priorityClass(p: string) {
  const map: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  }
  return map[p] || 'bg-gray-100 text-gray-700'
}

function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function openEditFromView() {
  if (viewingTask.value) {
    editingTask.value = { ...viewingTask.value }
    viewingTask.value = null
  }
}

function initTaskFiltersFromQuery() {
  const q = route.query
  taskSearchInput.value = (q.search as string) ?? ''
  taskStatusFilter.value = (q.status as string) ?? ''
  taskPriorityFilter.value = (q.priority as string) ?? ''
  taskDateFrom.value = (q.due_from as string) ?? ''
  taskDateTo.value = (q.due_to as string) ?? ''
  taskSort.value = (q.sort as string) || 'created_at'
  taskPage.value = Math.max(1, parseInt((q.page as string) || '1', 10) || 1)
}

function getTaskQuery() {
  const q: Record<string, string> = {}
  if (taskSearchInput.value) q.search = taskSearchInput.value
  if (taskStatusFilter.value) q.status = taskStatusFilter.value
  if (taskPriorityFilter.value) q.priority = taskPriorityFilter.value
  if (taskDateFrom.value) q.due_from = taskDateFrom.value
  if (taskDateTo.value) q.due_to = taskDateTo.value
  if (taskSort.value !== 'created_at') q.sort = taskSort.value
  if (taskPage.value > 1) q.page = String(taskPage.value)
  return q
}

function applyTaskFilters() {
  taskPage.value = 1
  router.replace({ path: route.path, query: getTaskQuery() })
}

function resetTaskFilters() {
  taskSearchInput.value = ''
  taskStatusFilter.value = ''
  taskPriorityFilter.value = ''
  taskDateFrom.value = ''
  taskDateTo.value = ''
  taskSort.value = 'created_at'
  taskPage.value = 1
  router.replace({ path: route.path, query: {} })
}

function goToTaskPage(newPage: number) {
  taskPage.value = newPage
  router.replace({ path: route.path, query: getTaskQuery() })
}

async function loadProject() {
  loading.value = true
  error.value = ''
  try {
    project.value = await api<Project>(`/api/projects/${projectId.value}?with_tasks=0`)
    editName.value = project.value.name
    editDescription.value = project.value.description || ''
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; statusCode?: number }
    error.value = err?.data?.message || 'Failed to load project.'
    if (err?.statusCode === 401 || err?.statusCode === 403) {
      const { logout } = useAuth()
      logout()
    }
  } finally {
    loading.value = false
  }
}

async function loadTasks() {
  if (!projectId.value) return
  tasksLoading.value = true
  try {
    const params = new URLSearchParams()
    if (taskSearchInput.value) params.set('search', taskSearchInput.value)
    if (taskStatusFilter.value) params.set('status', taskStatusFilter.value)
    if (taskPriorityFilter.value) params.set('priority', taskPriorityFilter.value)
    if (taskDateFrom.value) params.set('due_from', taskDateFrom.value)
    if (taskDateTo.value) params.set('due_to', taskDateTo.value)
    params.set('sort', taskSort.value)
    params.set('page', String(taskPage.value))
    params.set('per_page', String(taskPerPage.value))
    const res = await api<{ data: Task[]; meta: TasksMeta }>(`/api/projects/${projectId.value}/tasks?${params.toString()}`)
    if (res && typeof res === 'object' && 'data' in res) {
      tasks.value = (res as { data: Task[] }).data
      tasksMeta.value = (res as { meta: TasksMeta }).meta ?? null
    } else {
      tasks.value = Array.isArray(res) ? (res as unknown as Task[]) : []
      tasksMeta.value = null
    }
  } catch {
    tasks.value = []
    tasksMeta.value = null
  } finally {
    tasksLoading.value = false
  }
}

async function updateProject() {
  editError.value = ''
  saving.value = true
  try {
    const updated = await api<Project>(`/api/projects/${projectId.value}`, {
      method: 'PUT',
      body: { name: editName.value, description: editDescription.value || null },
    })
    project.value = updated
    showEdit.value = false
  } catch (e: unknown) {
    const err = e as { data?: { message?: string; errors?: Record<string, string[]> } }
    editError.value = err?.data?.errors ? Object.values(err.data.errors).flat().join(' ') : (err?.data?.message || 'Failed to update.')
  } finally {
    saving.value = false
  }
}

async function doDeleteProject() {
  deletingProject.value = true
  try {
    await api(`/api/projects/${projectId.value}`, { method: 'DELETE' })
    showDeleteProjectModal.value = false
    await navigateTo('/projects')
  } catch {
    error.value = 'Failed to delete project.'
  } finally {
    deletingProject.value = false
  }
}

function openEditTask(task: Task) {
  editingTask.value = { ...task }
}

async function doDeleteTask() {
  if (taskToDelete.value === null) return
  const id = taskToDelete.value
  deletingTask.value = true
  try {
    await api(`/api/projects/${projectId.value}/tasks/${id}`, { method: 'DELETE' })
    taskToDelete.value = null
    await loadTasks()
  } catch {
    error.value = 'Failed to delete task.'
  } finally {
    deletingTask.value = false
  }
}

function onTaskSaved() {
  showAddTask.value = false
  loadTasks()
}

function onTaskUpdated() {
  editingTask.value = null
  loadTasks()
}

watch(projectId, () => {
  initTaskFiltersFromQuery()
  loadProject().then(() => loadTasks())
}, { immediate: true })

watch(() => route.query, () => {
  initTaskFiltersFromQuery()
  if (project.value) loadTasks()
}, { deep: true })
</script>
