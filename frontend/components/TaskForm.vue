<template>
  <form class="mt-4 space-y-4" @submit.prevent="submit">
    <div v-if="formError" class="rounded-md bg-red-50 p-2 text-sm text-red-700">{{ formError }}</div>
    <div>
      <label for="task-title" class="block text-sm font-medium text-gray-700">Title</label>
      <input
        id="task-title"
        v-model="form.title"
        type="text"
        required
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
    <div>
      <label for="task-description" class="block text-sm font-medium text-gray-700">Description (optional)</label>
      <textarea
        id="task-description"
        v-model="form.description"
        rows="2"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
    <div>
      <label for="task-status" class="block text-sm font-medium text-gray-700">Status</label>
      <select
        id="task-status"
        v-model="form.status"
        required
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>
    </div>
    <div>
      <label for="task-priority" class="block text-sm font-medium text-gray-700">Priority</label>
      <select
        id="task-priority"
        v-model="form.priority"
        required
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
    <div>
      <label for="task-due_date" class="block text-sm font-medium text-gray-700">Due date (optional)</label>
      <input
        id="task-due_date"
        v-model="form.due_date"
        type="date"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
    <div class="flex justify-end gap-2">
      <button
        type="button"
        class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="saving"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {{ saving ? 'Saving...' : (task ? 'Save' : 'Add task') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
interface Task {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  due_date?: string | null
}

const props = defineProps<{
  projectId: number
  task?: Task | null
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const { api } = useApi()
const form = reactive({
  title: props.task?.title ?? '',
  description: props.task?.description ?? '',
  status: props.task?.status ?? 'todo',
  priority: props.task?.priority ?? 'medium',
  due_date: props.task?.due_date ?? '',
})
const formError = ref('')
const saving = ref(false)

watch(() => props.task, (t) => {
  if (t) {
    form.title = t.title
    form.description = t.description ?? ''
    form.status = t.status
    form.priority = t.priority
    form.due_date = t.due_date ?? ''
  }
}, { immediate: true })

async function submit() {
  formError.value = ''
  saving.value = true
  const body = {
    title: form.title,
    description: form.description || null,
    status: form.status,
    priority: form.priority,
    due_date: form.due_date || null,
  }
  try {
    if (props.task) {
      await api(`/api/projects/${props.projectId}/tasks/${props.task.id}`, {
        method: 'PATCH',
        body,
      })
    } else {
      await api(`/api/projects/${props.projectId}/tasks`, {
        method: 'POST',
        body,
      })
    }
    emit('saved')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string; errors?: Record<string, string[]> } }
    formError.value = err?.data?.errors ? Object.values(err.data.errors).flat().join(' ') : (err?.data?.message || 'Failed to save task.')
  } finally {
    saving.value = false
  }
}
</script>
