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
            @click="confirmDelete"
          >
            Delete
          </button>
        </div>
      </div>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">Tasks</h2>
        <button
          type="button"
          class="mb-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          @click="showAddTask = true"
        >
          Add task
        </button>
        <ul class="space-y-3">
          <li
            v-for="task in project.tasks"
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
                @click="openEditTask(task)"
              >
                Edit
              </button>
              <button
                type="button"
                class="text-sm text-red-600 hover:text-red-500"
                @click="deleteTask(task.id)"
              >
                Delete
              </button>
            </div>
          </li>
          <li v-if="!project.tasks?.length" class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
            No tasks. Add one above.
          </li>
        </ul>
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

const route = useRoute()
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
const editingTask = ref<Task | null>(null)

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

async function loadProject() {
  loading.value = true
  error.value = ''
  try {
    project.value = await api<Project>(`/api/projects/${projectId.value}`)
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

async function confirmDelete() {
  if (!confirm('Delete this project and all its tasks?')) return
  try {
    await api(`/api/projects/${projectId.value}`, { method: 'DELETE' })
    await navigateTo('/projects')
  } catch {
    error.value = 'Failed to delete project.'
  }
}

function openEditTask(task: Task) {
  editingTask.value = { ...task }
}

async function deleteTask(taskId: number) {
  if (!confirm('Delete this task?')) return
  try {
    await api(`/api/projects/${projectId.value}/tasks/${taskId}`, { method: 'DELETE' })
    if (project.value?.tasks) {
      project.value.tasks = project.value.tasks.filter((t) => t.id !== taskId)
    }
  } catch {
    error.value = 'Failed to delete task.'
  }
}

function onTaskSaved() {
  showAddTask.value = false
  loadProject()
}

function onTaskUpdated() {
  editingTask.value = null
  loadProject()
}

watch(projectId, loadProject, { immediate: true })
</script>
