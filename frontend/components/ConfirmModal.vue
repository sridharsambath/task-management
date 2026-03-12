<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="emit('cancel')"
      >
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="emit('cancel')" />
        <div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-slate-900/20">
          <div class="p-6">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
              <AlertTriangle class="h-6 w-6 text-red-600" />
            </div>
            <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
            <p class="mt-2 text-sm text-slate-500 leading-relaxed">{{ message }}</p>
          </div>
          <div class="border-t border-slate-100 px-6 py-4 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              :disabled="loading"
              @click="emit('cancel')"
            >
              Cancel
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              :disabled="loading"
              @click="emit('confirm')"
            >
              <Loader2 v-if="loading" class="h-3.5 w-3.5 animate-spin" />
              {{ loading ? 'Deleting...' : (confirmLabel || 'Delete') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { AlertTriangle, Loader2 } from 'lucide-vue-next'

defineProps<{
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
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
