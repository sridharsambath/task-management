<template>
  <div>
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse h-8 w-48 rounded-xl bg-slate-200" />
      <div class="animate-pulse h-4 w-72 rounded-lg bg-slate-200" />
    </div>
    <div v-else-if="error" class="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 p-5 text-red-700">
      <AlertCircle class="h-5 w-5 mt-0.5 flex-shrink-0" />
      <p>{{ error }}</p>
    </div>
    <template v-else-if="project">
      <!-- Project header -->
      <div class="mb-8">
        <NuxtLink to="/projects" class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-3">
          <ChevronLeft class="h-4 w-4" />
          Back to projects
        </NuxtLink>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200">
              <FolderOpen class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-900">{{ project.name }}</h1>
              <p v-if="project.description" class="mt-1 text-sm text-slate-500">{{ project.description }}</p>
              <p v-else class="mt-1 text-sm text-slate-400 italic">No description</p>
            </div>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              @click="showEdit = true"
            >
              <Pencil class="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
              @click="showDeleteProjectModal = true"
            >
              <Trash2 class="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div class="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

      <!-- Tasks section -->
      <section>
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Tasks</h2>
            <p class="text-sm text-slate-500">
              <span v-if="tasksMeta">{{ tasksMeta.total }} task{{ tasksMeta.total === 1 ? '' : 's' }}</span>
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all"
            @click="showAddTask = true"
          >
            <Plus class="h-4 w-4" />
            Add task
          </button>
        </div>

        <!-- Task filters -->
        <div class="mb-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm p-4">
          <div class="flex flex-wrap items-end gap-3">
            <div class="flex-1 min-w-[160px]">
              <label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide">Search</label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search class="h-3.5 w-3.5 text-slate-400" />
                </div>
                <input
                  v-model="taskSearchInput"
                  type="search"
                  placeholder="Search tasks..."
                  class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
                />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide">Status</label>
              <select
                v-model="taskStatusFilter"
                class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
              >
                <option value="">All statuses</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide">Priority</label>
              <select
                v-model="taskPriorityFilter"
                class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
              >
                <option value="">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide">Sort</label>
              <select
                v-model="taskSort"
                class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
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
            <div>
              <label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide">From date</label>
              <input
                v-model="taskDateFrom"
                type="date"
                class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide">To date</label>
              <input
                v-model="taskDateTo"
                type="date"
                class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                @click="applyTaskFilters"
              >
                <Filter class="h-3.5 w-3.5" />
                Apply
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                @click="resetTaskFilters"
              >
                <X class="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Tasks loading -->
        <div v-if="tasksLoading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl bg-white/60 border border-slate-100 h-20" />
        </div>

        <template v-else>
          <div class="space-y-3">
            <!-- Task card -->
            <div
              v-for="task in tasks"
              :key="task.id"
              class="group flex items-start justify-between rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-4 sm:p-5"
            >
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <!-- Status icon -->
                <div class="mt-0.5 flex-shrink-0">
                  <div v-if="task.status === 'done'" class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 class="h-4 w-4 text-emerald-600" />
                  </div>
                  <div v-else-if="task.status === 'in_progress'" class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <Clock class="h-4 w-4 text-blue-600" />
                  </div>
                  <div v-else class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                    <Circle class="h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="font-medium text-slate-900 truncate">{{ task.title }}</span>
                    <span class="inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium" :class="statusBadgeClass(task.status)">
                      {{ statusLabel(task.status) }}
                    </span>
                    <span class="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium" :class="priorityBadgeClass(task.priority)">
                      <Flame v-if="task.priority === 'high'" class="h-2.5 w-2.5" />
                      <Minus v-else-if="task.priority === 'medium'" class="h-2.5 w-2.5" />
                      <ArrowDown v-else class="h-2.5 w-2.5" />
                      {{ task.priority }}
                    </span>
                  </div>
                  <p v-if="task.description" class="text-sm text-slate-500 line-clamp-1">{{ task.description }}</p>
                  <div v-if="task.due_date" class="mt-1.5 inline-flex items-center gap-1 text-xs text-slate-400">
                    <CalendarDays class="h-3 w-3" />
                    {{ formatDueDate(task.due_date) }}
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-1 ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  class="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  title="View details"
                  @click="viewingTask = { ...task }"
                >
                  <Eye class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  title="Edit task"
                  @click="openEditTask(task)"
                >
                  <Pencil class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete task"
                  @click="taskToDelete = task.id"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Empty state -->
            <div
              v-if="tasks.length === 0"
              class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center"
            >
              <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <ClipboardList class="h-7 w-7 text-slate-400" />
              </div>
              <h3 class="text-sm font-semibold text-slate-700">
                {{ taskSearchInput || taskStatusFilter || taskPriorityFilter || taskDateFrom || taskDateTo ? 'No matching tasks' : 'No tasks yet' }}
              </h3>
              <p class="mt-1 text-xs text-slate-500">
                {{ taskSearchInput || taskStatusFilter || taskPriorityFilter || taskDateFrom || taskDateTo ? 'Try adjusting your filters.' : 'Add your first task to get started.' }}
              </p>
            </div>
          </div>

          <!-- Task pagination -->
          <div v-if="tasksMeta && tasksMeta.last_page > 1" class="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-slate-500">
              Showing <span class="font-medium text-slate-700">{{ tasksMeta.from ?? 0 }}–{{ tasksMeta.to ?? 0 }}</span> of <span class="font-medium text-slate-700">{{ tasksMeta.total }}</span>
            </p>
            <div class="flex items-center gap-1">
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                :disabled="tasksMeta.current_page <= 1"
                @click="goToTaskPage(tasksMeta.current_page - 1)"
              >
                <ChevronLeft class="h-4 w-4" />
                Previous
              </button>
              <span class="px-3 py-1.5 text-sm text-slate-500">
                {{ tasksMeta.current_page }} / {{ tasksMeta.last_page }}
              </span>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                :disabled="tasksMeta.current_page >= tasksMeta.last_page"
                @click="goToTaskPage(tasksMeta.current_page + 1)"
              >
                Next
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </div>
        </template>
      </section>

      <!-- Edit project modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showEdit"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showEdit = false" />
            <div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-slate-900/20">
              <div class="border-b border-slate-100 p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                      <Pencil class="h-4 w-4 text-amber-600" />
                    </div>
                    <h2 class="text-lg font-semibold text-slate-900">Edit project</h2>
                  </div>
                  <button type="button" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" @click="showEdit = false">
                    <X class="h-5 w-5" />
                  </button>
                </div>
              </div>
              <form class="p-6 space-y-4" @submit.prevent="updateProject">
                <div v-if="editError" class="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
                  <AlertCircle class="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{{ editError }}</span>
                </div>
                <div class="space-y-1.5">
                  <label for="edit-name" class="block text-sm font-medium text-slate-700">Project name</label>
                  <input
                    id="edit-name"
                    v-model="editName"
                    type="text"
                    required
                    class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
                  />
                </div>
                <div class="space-y-1.5">
                  <label for="edit-description" class="block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    id="edit-description"
                    v-model="editDescription"
                    rows="3"
                    class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors resize-none"
                  />
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" @click="showEdit = false">Cancel</button>
                  <button type="submit" :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-600 hover:to-violet-700 disabled:opacity-60 transition-all">
                    <Loader2 v-if="saving" class="h-3.5 w-3.5 animate-spin" />
                    {{ saving ? 'Saving...' : 'Save changes' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Add task modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showAddTask"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showAddTask = false" />
            <div class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl shadow-slate-900/20">
              <div class="border-b border-slate-100 p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                      <Plus class="h-5 w-5 text-indigo-600" />
                    </div>
                    <h2 class="text-lg font-semibold text-slate-900">Add task</h2>
                  </div>
                  <button type="button" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" @click="showAddTask = false">
                    <X class="h-5 w-5" />
                  </button>
                </div>
              </div>
              <TaskForm
                :project-id="projectId"
                @saved="onTaskSaved"
                @cancel="showAddTask = false"
              />
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Edit task modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="editingTask"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="editingTask = null" />
            <div class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl shadow-slate-900/20">
              <div class="border-b border-slate-100 p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                      <Pencil class="h-4 w-4 text-amber-600" />
                    </div>
                    <h2 class="text-lg font-semibold text-slate-900">Edit task</h2>
                  </div>
                  <button type="button" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" @click="editingTask = null">
                    <X class="h-5 w-5" />
                  </button>
                </div>
              </div>
              <TaskForm
                :project-id="projectId"
                :task="editingTask"
                @saved="onTaskUpdated"
                @cancel="editingTask = null"
              />
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- View task modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="viewingTask"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="viewingTask = null" />
            <div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-slate-900/20">
              <div class="border-b border-slate-100 p-6">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-semibold text-slate-900">Task details</h2>
                  <button type="button" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" @click="viewingTask = null">
                    <X class="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div class="p-6 space-y-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Title</p>
                  <p class="text-base font-semibold text-slate-900">{{ viewingTask.title }}</p>
                </div>
                <div v-if="viewingTask.description">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Description</p>
                  <p class="text-sm text-slate-700 whitespace-pre-wrap">{{ viewingTask.description }}</p>
                </div>
                <div class="flex gap-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Status</p>
                    <span class="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold" :class="statusBadgeClass(viewingTask.status)">
                      {{ statusLabel(viewingTask.status) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Priority</p>
                    <span class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold" :class="priorityBadgeClass(viewingTask.priority)">
                      <Flame v-if="viewingTask.priority === 'high'" class="h-3 w-3" />
                      <Minus v-else-if="viewingTask.priority === 'medium'" class="h-3 w-3" />
                      <ArrowDown v-else class="h-3 w-3" />
                      {{ viewingTask.priority }}
                    </span>
                  </div>
                </div>
                <div v-if="viewingTask.due_date">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Due date</p>
                  <div class="inline-flex items-center gap-1.5 text-sm text-slate-700">
                    <CalendarDays class="h-4 w-4 text-slate-400" />
                    {{ formatDueDate(viewingTask.due_date) }}
                  </div>
                </div>
              </div>
              <div class="border-t border-slate-100 p-4 flex justify-end gap-2">
                <button
                  type="button"
                  class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  @click="viewingTask = null"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                  @click="openEditFromView()"
                >
                  <Pencil class="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Delete project modal -->
      <ConfirmModal
        v-if="showDeleteProjectModal"
        title="Delete project"
        message="Are you sure you want to delete this project and all its tasks? This action cannot be undone."
        confirm-label="Delete project"
        :loading="deletingProject"
        @confirm="doDeleteProject"
        @cancel="showDeleteProjectModal = false"
      />

      <!-- Delete task modal -->
      <ConfirmModal
        v-if="taskToDelete !== null"
        title="Delete task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirm-label="Delete task"
        :loading="deletingTask"
        @confirm="doDeleteTask"
        @cancel="taskToDelete = null"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronLeft, ChevronRight, FolderOpen, Plus, Pencil, Trash2, Search, Filter, X,
  AlertCircle, Loader2, CheckCircle2, Clock, Circle, Flame, Minus, ArrowDown,
  CalendarDays, Eye, ClipboardList,
} from 'lucide-vue-next'

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

function statusBadgeClass(s: string) {
  const map: Record<string, string> = {
    todo: 'bg-slate-100 text-slate-600',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-emerald-100 text-emerald-700',
  }
  return map[s] || 'bg-slate-100 text-slate-600'
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  }
  return map[s] || s
}

function priorityBadgeClass(p: string) {
  const map: Record<string, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
  }
  return map[p] || 'bg-slate-100 text-slate-600'
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
