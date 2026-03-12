<template>
  <div class="p-6 space-y-4">
    <div v-if="formError" class="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
      <AlertCircle class="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span>{{ formError }}</span>
    </div>

    <form class="space-y-4" @submit.prevent="submit">
      <!-- Title -->
      <div class="space-y-1.5">
        <label for="task-title" class="block text-sm font-medium text-slate-700">
          Title <span class="text-red-400">*</span>
        </label>
        <input
          id="task-title"
          v-model="form.title"
          type="text"
          required
          placeholder="e.g. Set up CI/CD pipeline"
          class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
        />
      </div>

      <!-- Description with AI suggestion -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="task-description" class="block text-sm font-medium text-slate-700">
            Description <span class="text-slate-400 font-normal">(optional)</span>
          </label>
          <button
            type="button"
            :disabled="aiLoading || !form.title.trim()"
            class="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="suggestDescription"
          >
            <Sparkles v-if="!aiLoading" class="h-3 w-3" />
            <Loader2 v-else class="h-3 w-3 animate-spin" />
            {{ aiLoading ? 'Generating...' : 'AI suggest' }}
          </button>
        </div>
        <div class="relative">
          <textarea
            id="task-description"
            v-model="form.description"
            rows="3"
            placeholder="Describe what needs to be done..."
            class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors resize-none"
          />
          <div v-if="aiError" class="mt-1.5 flex items-center gap-1 text-xs text-amber-600">
            <AlertCircle class="h-3 w-3" />
            {{ aiError }}
          </div>
        </div>
        <p class="text-xs text-slate-400">Tip: Type a title first, then click "AI suggest" to auto-generate a description using Claude.</p>
      </div>

      <!-- Status and Priority row -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="task-status" class="block text-sm font-medium text-slate-700">Status</label>
          <div class="relative">
            <select
              id="task-status"
              v-model="form.status"
              required
              class="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown class="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="task-priority" class="block text-sm font-medium text-slate-700">Priority</label>
          <div class="relative">
            <select
              id="task-priority"
              v-model="form.priority"
              required
              class="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown class="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Due date -->
      <div class="space-y-1.5">
        <label for="task-due_date" class="block text-sm font-medium text-slate-700">
          Due date <span class="text-slate-400 font-normal">(optional)</span>
        </label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <CalendarDays class="h-4 w-4 text-slate-400" />
          </div>
          <input
            id="task-due_date"
            v-model="form.due_date"
            type="date"
            class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-600 hover:to-violet-700 disabled:opacity-60 transition-all shadow-sm shadow-indigo-200"
        >
          <Loader2 v-if="saving" class="h-3.5 w-3.5 animate-spin" />
          {{ saving ? 'Saving...' : (task ? 'Save changes' : 'Add task') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, Sparkles, Loader2, CalendarDays, ChevronDown } from 'lucide-vue-next'

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
const aiLoading = ref(false)
const aiError = ref('')

watch(() => props.task, (t) => {
  if (t) {
    form.title = t.title
    form.description = t.description ?? ''
    form.status = t.status
    form.priority = t.priority
    form.due_date = t.due_date ?? ''
  }
}, { immediate: true })

async function suggestDescription() {
  if (!form.title.trim()) return
  aiLoading.value = true
  aiError.value = ''
  try {
    const res = await $fetch<{ description: string }>('/api/ai-suggest', {
      method: 'POST',
      body: { title: form.title },
    })
    if (res.description) {
      form.description = res.description
    }
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string }; message?: string }
    aiError.value = err?.data?.statusMessage || err?.message || 'AI suggestion failed.'
  } finally {
    aiLoading.value = false
  }
}

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
