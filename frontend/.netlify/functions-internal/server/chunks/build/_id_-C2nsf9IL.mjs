import { _ as __nuxt_component_0 } from './nuxt-link-DMl0X9B3.mjs';
import { defineComponent, computed, ref, watch, unref, withCtx, createVNode, createTextVNode, reactive, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
import { AlertCircle, ChevronLeft, FolderOpen, Pencil, Trash2, Plus, Search, Filter, X, CheckCircle2, Clock, Circle, Flame, Minus, ArrowDown, CalendarDays, Eye, ClipboardList, ChevronRight, Loader2, Sparkles, ChevronDown, AlertTriangle } from 'lucide-vue-next';
import { u as useApi } from './useApi-BmygG2T_.mjs';
import { _ as _export_sfc, b as useRoute, a as useRouter, u as useAuth, n as navigateTo } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TaskForm",
  __ssrInlineRender: true,
  props: {
    projectId: {},
    task: {}
  },
  emits: ["saved", "cancel"],
  setup(__props, { emit: __emit }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const props = __props;
    useApi();
    const form = reactive({
      title: (_b = (_a = props.task) == null ? void 0 : _a.title) != null ? _b : "",
      description: (_d = (_c = props.task) == null ? void 0 : _c.description) != null ? _d : "",
      status: (_f = (_e = props.task) == null ? void 0 : _e.status) != null ? _f : "todo",
      priority: (_h = (_g = props.task) == null ? void 0 : _g.priority) != null ? _h : "medium",
      due_date: (_j = (_i = props.task) == null ? void 0 : _i.due_date) != null ? _j : ""
    });
    const formError = ref("");
    const saving = ref(false);
    const aiLoading = ref(false);
    const aiError = ref("");
    watch(() => props.task, (t) => {
      var _a2, _b2;
      if (t) {
        form.title = t.title;
        form.description = (_a2 = t.description) != null ? _a2 : "";
        form.status = t.status;
        form.priority = t.priority;
        form.due_date = (_b2 = t.due_date) != null ? _b2 : "";
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 space-y-4" }, _attrs))}>`);
      if (unref(formError)) {
        _push(`<div class="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">`);
        _push(ssrRenderComponent(unref(AlertCircle), { class: "h-4 w-4 mt-0.5 flex-shrink-0" }, null, _parent));
        _push(`<span>${ssrInterpolate(unref(formError))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-4"><div class="space-y-1.5"><label for="task-title" class="block text-sm font-medium text-slate-700"> Title <span class="text-red-400">*</span></label><input id="task-title"${ssrRenderAttr("value", unref(form).title)} type="text" required placeholder="e.g. Set up CI/CD pipeline" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"></div><div class="space-y-1.5"><div class="flex items-center justify-between"><label for="task-description" class="block text-sm font-medium text-slate-700"> Description <span class="text-slate-400 font-normal">(optional)</span></label><button type="button"${ssrIncludeBooleanAttr(unref(aiLoading) || !unref(form).title.trim()) ? " disabled" : ""} class="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">`);
      if (!unref(aiLoading)) {
        _push(ssrRenderComponent(unref(Sparkles), { class: "h-3 w-3" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Loader2), { class: "h-3 w-3 animate-spin" }, null, _parent));
      }
      _push(` ${ssrInterpolate(unref(aiLoading) ? "Generating..." : "AI suggest")}</button></div><div class="relative"><textarea id="task-description" rows="3" placeholder="Describe what needs to be done..." class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors resize-none">${ssrInterpolate(unref(form).description)}</textarea>`);
      if (unref(aiError)) {
        _push(`<div class="mt-1.5 flex items-center gap-1 text-xs text-amber-600">`);
        _push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent));
        _push(` ${ssrInterpolate(unref(aiError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-xs text-slate-400">Tip: Type a title first, then click &quot;AI suggest&quot; to auto-generate a description using Claude.</p></div><div class="grid grid-cols-2 gap-4"><div class="space-y-1.5"><label for="task-status" class="block text-sm font-medium text-slate-700">Status</label><div class="relative"><select id="task-status" required class="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"><option value="todo"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "todo") : ssrLooseEqual(unref(form).status, "todo")) ? " selected" : ""}>To Do</option><option value="in_progress"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "in_progress") : ssrLooseEqual(unref(form).status, "in_progress")) ? " selected" : ""}>In Progress</option><option value="done"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "done") : ssrLooseEqual(unref(form).status, "done")) ? " selected" : ""}>Done</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 text-slate-400" }, null, _parent));
      _push(`</div></div></div><div class="space-y-1.5"><label for="task-priority" class="block text-sm font-medium text-slate-700">Priority</label><div class="relative"><select id="task-priority" required class="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"><option value="low"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "low") : ssrLooseEqual(unref(form).priority, "low")) ? " selected" : ""}>Low</option><option value="medium"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "medium") : ssrLooseEqual(unref(form).priority, "medium")) ? " selected" : ""}>Medium</option><option value="high"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "high") : ssrLooseEqual(unref(form).priority, "high")) ? " selected" : ""}>High</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 text-slate-400" }, null, _parent));
      _push(`</div></div></div></div><div class="space-y-1.5"><label for="task-due_date" class="block text-sm font-medium text-slate-700"> Due date <span class="text-slate-400 font-normal">(optional)</span></label><div class="relative"><div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">`);
      _push(ssrRenderComponent(unref(CalendarDays), { class: "h-4 w-4 text-slate-400" }, null, _parent));
      _push(`</div><input id="task-due_date"${ssrRenderAttr("value", unref(form).due_date)} type="date" class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"></div></div><div class="flex justify-end gap-2 pt-2 border-t border-slate-100"><button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"> Cancel </button><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-600 hover:to-violet-700 disabled:opacity-60 transition-all shadow-sm shadow-indigo-200">`);
      if (unref(saving)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "h-3.5 w-3.5 animate-spin" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(saving) ? "Saving..." : __props.task ? "Save changes" : "Add task")}</button></div></form></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TaskForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ConfirmModal",
  __ssrInlineRender: true,
  props: {
    title: {},
    message: {},
    confirmLabel: {},
    loading: { type: Boolean }
  },
  emits: ["confirm", "cancel"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-e364d184><div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" data-v-e364d184></div><div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-slate-900/20" data-v-e364d184><div class="p-6" data-v-e364d184><div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100" data-v-e364d184>`);
        _push2(ssrRenderComponent(unref(AlertTriangle), { class: "h-6 w-6 text-red-600" }, null, _parent));
        _push2(`</div><h2 class="text-lg font-semibold text-slate-900" data-v-e364d184>${ssrInterpolate(__props.title)}</h2><p class="mt-2 text-sm text-slate-500 leading-relaxed" data-v-e364d184>${ssrInterpolate(__props.message)}</p></div><div class="border-t border-slate-100 px-6 py-4 flex justify-end gap-2" data-v-e364d184><button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""} data-v-e364d184> Cancel </button><button type="button" class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""} data-v-e364d184>`);
        if (__props.loading) {
          _push2(ssrRenderComponent(unref(Loader2), { class: "h-3.5 w-3.5 animate-spin" }, null, _parent));
        } else {
          _push2(`<!---->`);
        }
        _push2(` ${ssrInterpolate(__props.loading ? "Deleting..." : __props.confirmLabel || "Delete")}</button></div></div></div>`);
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-e364d184"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const projectId = computed(() => Number(route.params.id));
    const { api } = useApi();
    const project = ref(null);
    const loading = ref(true);
    const error = ref("");
    const showEdit = ref(false);
    const editName = ref("");
    const editDescription = ref("");
    const editError = ref("");
    const saving = ref(false);
    const showAddTask = ref(false);
    const viewingTask = ref(null);
    const editingTask = ref(null);
    const showDeleteProjectModal = ref(false);
    const deletingProject = ref(false);
    const taskToDelete = ref(null);
    const deletingTask = ref(false);
    const tasks = ref([]);
    const tasksMeta = ref(null);
    const tasksLoading = ref(false);
    const taskSearchInput = ref("");
    const taskStatusFilter = ref("");
    const taskPriorityFilter = ref("");
    const taskDateFrom = ref("");
    const taskDateTo = ref("");
    const taskSort = ref("created_at");
    const taskPage = ref(1);
    const taskPerPage = ref(10);
    function statusBadgeClass(s) {
      const map = {
        todo: "bg-slate-100 text-slate-600",
        in_progress: "bg-blue-100 text-blue-700",
        done: "bg-emerald-100 text-emerald-700"
      };
      return map[s] || "bg-slate-100 text-slate-600";
    }
    function statusLabel(s) {
      const map = {
        todo: "To Do",
        in_progress: "In Progress",
        done: "Done"
      };
      return map[s] || s;
    }
    function priorityBadgeClass(p) {
      const map = {
        low: "bg-slate-100 text-slate-600",
        medium: "bg-amber-100 text-amber-700",
        high: "bg-red-100 text-red-700"
      };
      return map[p] || "bg-slate-100 text-slate-600";
    }
    function formatDueDate(dateStr) {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return d.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
    }
    function initTaskFiltersFromQuery() {
      var _a, _b, _c, _d, _e;
      const q = route.query;
      taskSearchInput.value = (_a = q.search) != null ? _a : "";
      taskStatusFilter.value = (_b = q.status) != null ? _b : "";
      taskPriorityFilter.value = (_c = q.priority) != null ? _c : "";
      taskDateFrom.value = (_d = q.due_from) != null ? _d : "";
      taskDateTo.value = (_e = q.due_to) != null ? _e : "";
      taskSort.value = q.sort || "created_at";
      taskPage.value = Math.max(1, parseInt(q.page || "1", 10) || 1);
    }
    async function loadProject() {
      var _a;
      loading.value = true;
      error.value = "";
      try {
        project.value = await api(`/api/projects/${projectId.value}?with_tasks=0`);
        editName.value = project.value.name;
        editDescription.value = project.value.description || "";
      } catch (e) {
        const err = e;
        error.value = ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.message) || "Failed to load project.";
        if ((err == null ? void 0 : err.statusCode) === 401 || (err == null ? void 0 : err.statusCode) === 403) {
          const { logout } = useAuth();
          logout();
        }
      } finally {
        loading.value = false;
      }
    }
    async function loadTasks() {
      var _a;
      if (!projectId.value) return;
      tasksLoading.value = true;
      try {
        const params = new URLSearchParams();
        if (taskSearchInput.value) params.set("search", taskSearchInput.value);
        if (taskStatusFilter.value) params.set("status", taskStatusFilter.value);
        if (taskPriorityFilter.value) params.set("priority", taskPriorityFilter.value);
        if (taskDateFrom.value) params.set("due_from", taskDateFrom.value);
        if (taskDateTo.value) params.set("due_to", taskDateTo.value);
        params.set("sort", taskSort.value);
        params.set("page", String(taskPage.value));
        params.set("per_page", String(taskPerPage.value));
        const res = await api(`/api/projects/${projectId.value}/tasks?${params.toString()}`);
        if (res && typeof res === "object" && "data" in res) {
          tasks.value = res.data;
          tasksMeta.value = (_a = res.meta) != null ? _a : null;
        } else {
          tasks.value = Array.isArray(res) ? res : [];
          tasksMeta.value = null;
        }
      } catch {
        tasks.value = [];
        tasksMeta.value = null;
      } finally {
        tasksLoading.value = false;
      }
    }
    async function doDeleteProject() {
      deletingProject.value = true;
      try {
        await api(`/api/projects/${projectId.value}`, { method: "DELETE" });
        showDeleteProjectModal.value = false;
        await navigateTo("/projects");
      } catch {
        error.value = "Failed to delete project.";
      } finally {
        deletingProject.value = false;
      }
    }
    async function doDeleteTask() {
      if (taskToDelete.value === null) return;
      const id = taskToDelete.value;
      deletingTask.value = true;
      try {
        await api(`/api/projects/${projectId.value}/tasks/${id}`, { method: "DELETE" });
        taskToDelete.value = null;
        await loadTasks();
      } catch {
        error.value = "Failed to delete task.";
      } finally {
        deletingTask.value = false;
      }
    }
    function onTaskSaved() {
      showAddTask.value = false;
      loadTasks();
    }
    function onTaskUpdated() {
      editingTask.value = null;
      loadTasks();
    }
    watch(projectId, () => {
      initTaskFiltersFromQuery();
      loadProject().then(() => loadTasks());
    }, { immediate: true });
    watch(() => route.query, () => {
      initTaskFiltersFromQuery();
      if (project.value) loadTasks();
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_TaskForm = _sfc_main$2;
      const _component_ConfirmModal = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-4ebab0e8>`);
      if (unref(loading)) {
        _push(`<div class="space-y-4" data-v-4ebab0e8><div class="animate-pulse h-8 w-48 rounded-xl bg-slate-200" data-v-4ebab0e8></div><div class="animate-pulse h-4 w-72 rounded-lg bg-slate-200" data-v-4ebab0e8></div></div>`);
      } else if (unref(error)) {
        _push(`<div class="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 p-5 text-red-700" data-v-4ebab0e8>`);
        _push(ssrRenderComponent(unref(AlertCircle), { class: "h-5 w-5 mt-0.5 flex-shrink-0" }, null, _parent));
        _push(`<p data-v-4ebab0e8>${ssrInterpolate(unref(error))}</p></div>`);
      } else if (unref(project)) {
        _push(`<!--[--><div class="mb-8" data-v-4ebab0e8>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/projects",
          class: "inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-3"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent2, _scopeId));
              _push2(` Back to projects `);
            } else {
              return [
                createVNode(unref(ChevronLeft), { class: "h-4 w-4" }),
                createTextVNode(" Back to projects ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between" data-v-4ebab0e8><div class="flex items-start gap-4" data-v-4ebab0e8><div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200" data-v-4ebab0e8>`);
        _push(ssrRenderComponent(unref(FolderOpen), { class: "h-6 w-6 text-white" }, null, _parent));
        _push(`</div><div data-v-4ebab0e8><h1 class="text-2xl font-bold text-slate-900" data-v-4ebab0e8>${ssrInterpolate(unref(project).name)}</h1>`);
        if (unref(project).description) {
          _push(`<p class="mt-1 text-sm text-slate-500" data-v-4ebab0e8>${ssrInterpolate(unref(project).description)}</p>`);
        } else {
          _push(`<p class="mt-1 text-sm text-slate-400 italic" data-v-4ebab0e8>No description</p>`);
        }
        _push(`</div></div><div class="flex gap-2 flex-shrink-0" data-v-4ebab0e8><button type="button" class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm" data-v-4ebab0e8>`);
        _push(ssrRenderComponent(unref(Pencil), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(` Edit </button><button type="button" class="inline-flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors" data-v-4ebab0e8>`);
        _push(ssrRenderComponent(unref(Trash2), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(` Delete </button></div></div></div><div class="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" data-v-4ebab0e8></div><section data-v-4ebab0e8><div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" data-v-4ebab0e8><div data-v-4ebab0e8><h2 class="text-lg font-semibold text-slate-900" data-v-4ebab0e8>Tasks</h2><p class="text-sm text-slate-500" data-v-4ebab0e8>`);
        if (unref(tasksMeta)) {
          _push(`<span data-v-4ebab0e8>${ssrInterpolate(unref(tasksMeta).total)} task${ssrInterpolate(unref(tasksMeta).total === 1 ? "" : "s")}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p></div><button type="button" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all" data-v-4ebab0e8>`);
        _push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
        _push(` Add task </button></div><div class="mb-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm p-4" data-v-4ebab0e8><div class="flex flex-wrap items-end gap-3" data-v-4ebab0e8><div class="flex-1 min-w-[160px]" data-v-4ebab0e8><label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide" data-v-4ebab0e8>Search</label><div class="relative" data-v-4ebab0e8><div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" data-v-4ebab0e8>`);
        _push(ssrRenderComponent(unref(Search), { class: "h-3.5 w-3.5 text-slate-400" }, null, _parent));
        _push(`</div><input${ssrRenderAttr("value", unref(taskSearchInput))} type="search" placeholder="Search tasks..." class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors" data-v-4ebab0e8></div></div><div data-v-4ebab0e8><label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide" data-v-4ebab0e8>Status</label><select class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors" data-v-4ebab0e8><option value="" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskStatusFilter)) ? ssrLooseContain(unref(taskStatusFilter), "") : ssrLooseEqual(unref(taskStatusFilter), "")) ? " selected" : ""}>All statuses</option><option value="todo" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskStatusFilter)) ? ssrLooseContain(unref(taskStatusFilter), "todo") : ssrLooseEqual(unref(taskStatusFilter), "todo")) ? " selected" : ""}>Todo</option><option value="in_progress" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskStatusFilter)) ? ssrLooseContain(unref(taskStatusFilter), "in_progress") : ssrLooseEqual(unref(taskStatusFilter), "in_progress")) ? " selected" : ""}>In progress</option><option value="done" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskStatusFilter)) ? ssrLooseContain(unref(taskStatusFilter), "done") : ssrLooseEqual(unref(taskStatusFilter), "done")) ? " selected" : ""}>Done</option></select></div><div data-v-4ebab0e8><label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide" data-v-4ebab0e8>Priority</label><select class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors" data-v-4ebab0e8><option value="" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskPriorityFilter)) ? ssrLooseContain(unref(taskPriorityFilter), "") : ssrLooseEqual(unref(taskPriorityFilter), "")) ? " selected" : ""}>All priorities</option><option value="low" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskPriorityFilter)) ? ssrLooseContain(unref(taskPriorityFilter), "low") : ssrLooseEqual(unref(taskPriorityFilter), "low")) ? " selected" : ""}>Low</option><option value="medium" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskPriorityFilter)) ? ssrLooseContain(unref(taskPriorityFilter), "medium") : ssrLooseEqual(unref(taskPriorityFilter), "medium")) ? " selected" : ""}>Medium</option><option value="high" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskPriorityFilter)) ? ssrLooseContain(unref(taskPriorityFilter), "high") : ssrLooseEqual(unref(taskPriorityFilter), "high")) ? " selected" : ""}>High</option></select></div><div data-v-4ebab0e8><label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide" data-v-4ebab0e8>Sort</label><select class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors" data-v-4ebab0e8><option value="created_at" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskSort)) ? ssrLooseContain(unref(taskSort), "created_at") : ssrLooseEqual(unref(taskSort), "created_at")) ? " selected" : ""}>Newest first</option><option value="created_at_asc" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskSort)) ? ssrLooseContain(unref(taskSort), "created_at_asc") : ssrLooseEqual(unref(taskSort), "created_at_asc")) ? " selected" : ""}>Oldest first</option><option value="title" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskSort)) ? ssrLooseContain(unref(taskSort), "title") : ssrLooseEqual(unref(taskSort), "title")) ? " selected" : ""}>Title A\u2013Z</option><option value="title_desc" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskSort)) ? ssrLooseContain(unref(taskSort), "title_desc") : ssrLooseEqual(unref(taskSort), "title_desc")) ? " selected" : ""}>Title Z\u2013A</option><option value="status" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskSort)) ? ssrLooseContain(unref(taskSort), "status") : ssrLooseEqual(unref(taskSort), "status")) ? " selected" : ""}>Status</option><option value="priority" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskSort)) ? ssrLooseContain(unref(taskSort), "priority") : ssrLooseEqual(unref(taskSort), "priority")) ? " selected" : ""}>Priority</option><option value="due_date" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskSort)) ? ssrLooseContain(unref(taskSort), "due_date") : ssrLooseEqual(unref(taskSort), "due_date")) ? " selected" : ""}>Due date (latest)</option><option value="due_date_asc" data-v-4ebab0e8${ssrIncludeBooleanAttr(Array.isArray(unref(taskSort)) ? ssrLooseContain(unref(taskSort), "due_date_asc") : ssrLooseEqual(unref(taskSort), "due_date_asc")) ? " selected" : ""}>Due date (earliest)</option></select></div><div data-v-4ebab0e8><label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide" data-v-4ebab0e8>From date</label><input${ssrRenderAttr("value", unref(taskDateFrom))} type="date" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors" data-v-4ebab0e8></div><div data-v-4ebab0e8><label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide" data-v-4ebab0e8>To date</label><input${ssrRenderAttr("value", unref(taskDateTo))} type="date" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors" data-v-4ebab0e8></div><div class="flex gap-2" data-v-4ebab0e8><button type="button" class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors" data-v-4ebab0e8>`);
        _push(ssrRenderComponent(unref(Filter), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(` Apply </button><button type="button" class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" data-v-4ebab0e8>`);
        _push(ssrRenderComponent(unref(X), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(` Reset </button></div></div></div>`);
        if (unref(tasksLoading)) {
          _push(`<div class="space-y-3" data-v-4ebab0e8><!--[-->`);
          ssrRenderList(4, (i) => {
            _push(`<div class="animate-pulse rounded-2xl bg-white/60 border border-slate-100 h-20" data-v-4ebab0e8></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!--[--><div class="space-y-3" data-v-4ebab0e8><!--[-->`);
          ssrRenderList(unref(tasks), (task) => {
            _push(`<div class="group flex items-start justify-between rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-4 sm:p-5" data-v-4ebab0e8><div class="flex items-start gap-3 flex-1 min-w-0" data-v-4ebab0e8><div class="mt-0.5 flex-shrink-0" data-v-4ebab0e8>`);
            if (task.status === "done") {
              _push(`<div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100" data-v-4ebab0e8>`);
              _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-4 w-4 text-emerald-600" }, null, _parent));
              _push(`</div>`);
            } else if (task.status === "in_progress") {
              _push(`<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100" data-v-4ebab0e8>`);
              _push(ssrRenderComponent(unref(Clock), { class: "h-4 w-4 text-blue-600" }, null, _parent));
              _push(`</div>`);
            } else {
              _push(`<div class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100" data-v-4ebab0e8>`);
              _push(ssrRenderComponent(unref(Circle), { class: "h-4 w-4 text-slate-400" }, null, _parent));
              _push(`</div>`);
            }
            _push(`</div><div class="flex-1 min-w-0" data-v-4ebab0e8><div class="flex flex-wrap items-center gap-2 mb-1" data-v-4ebab0e8><span class="font-medium text-slate-900 truncate" data-v-4ebab0e8>${ssrInterpolate(task.title)}</span><span class="${ssrRenderClass([statusBadgeClass(task.status), "inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium"])}" data-v-4ebab0e8>${ssrInterpolate(statusLabel(task.status))}</span><span class="${ssrRenderClass([priorityBadgeClass(task.priority), "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium"])}" data-v-4ebab0e8>`);
            if (task.priority === "high") {
              _push(ssrRenderComponent(unref(Flame), { class: "h-2.5 w-2.5" }, null, _parent));
            } else if (task.priority === "medium") {
              _push(ssrRenderComponent(unref(Minus), { class: "h-2.5 w-2.5" }, null, _parent));
            } else {
              _push(ssrRenderComponent(unref(ArrowDown), { class: "h-2.5 w-2.5" }, null, _parent));
            }
            _push(` ${ssrInterpolate(task.priority)}</span></div>`);
            if (task.description) {
              _push(`<p class="text-sm text-slate-500 line-clamp-1" data-v-4ebab0e8>${ssrInterpolate(task.description)}</p>`);
            } else {
              _push(`<!---->`);
            }
            if (task.due_date) {
              _push(`<div class="mt-1.5 inline-flex items-center gap-1 text-xs text-slate-400" data-v-4ebab0e8>`);
              _push(ssrRenderComponent(unref(CalendarDays), { class: "h-3 w-3" }, null, _parent));
              _push(` ${ssrInterpolate(formatDueDate(task.due_date))}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div><div class="flex items-center gap-1 ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" data-v-4ebab0e8><button type="button" class="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="View details" data-v-4ebab0e8>`);
            _push(ssrRenderComponent(unref(Eye), { class: "h-4 w-4" }, null, _parent));
            _push(`</button><button type="button" class="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit task" data-v-4ebab0e8>`);
            _push(ssrRenderComponent(unref(Pencil), { class: "h-4 w-4" }, null, _parent));
            _push(`</button><button type="button" class="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete task" data-v-4ebab0e8>`);
            _push(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent));
            _push(`</button></div></div>`);
          });
          _push(`<!--]-->`);
          if (unref(tasks).length === 0) {
            _push(`<div class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center" data-v-4ebab0e8><div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100" data-v-4ebab0e8>`);
            _push(ssrRenderComponent(unref(ClipboardList), { class: "h-7 w-7 text-slate-400" }, null, _parent));
            _push(`</div><h3 class="text-sm font-semibold text-slate-700" data-v-4ebab0e8>${ssrInterpolate(unref(taskSearchInput) || unref(taskStatusFilter) || unref(taskPriorityFilter) || unref(taskDateFrom) || unref(taskDateTo) ? "No matching tasks" : "No tasks yet")}</h3><p class="mt-1 text-xs text-slate-500" data-v-4ebab0e8>${ssrInterpolate(unref(taskSearchInput) || unref(taskStatusFilter) || unref(taskPriorityFilter) || unref(taskDateFrom) || unref(taskDateTo) ? "Try adjusting your filters." : "Add your first task to get started.")}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (unref(tasksMeta) && unref(tasksMeta).last_page > 1) {
            _push(`<div class="mt-5 flex flex-wrap items-center justify-between gap-3" data-v-4ebab0e8><p class="text-sm text-slate-500" data-v-4ebab0e8> Showing <span class="font-medium text-slate-700" data-v-4ebab0e8>${ssrInterpolate((_a = unref(tasksMeta).from) != null ? _a : 0)}\u2013${ssrInterpolate((_b = unref(tasksMeta).to) != null ? _b : 0)}</span> of <span class="font-medium text-slate-700" data-v-4ebab0e8>${ssrInterpolate(unref(tasksMeta).total)}</span></p><div class="flex items-center gap-1" data-v-4ebab0e8><button type="button" class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"${ssrIncludeBooleanAttr(unref(tasksMeta).current_page <= 1) ? " disabled" : ""} data-v-4ebab0e8>`);
            _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent));
            _push(` Previous </button><span class="px-3 py-1.5 text-sm text-slate-500" data-v-4ebab0e8>${ssrInterpolate(unref(tasksMeta).current_page)} / ${ssrInterpolate(unref(tasksMeta).last_page)}</span><button type="button" class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"${ssrIncludeBooleanAttr(unref(tasksMeta).current_page >= unref(tasksMeta).last_page) ? " disabled" : ""} data-v-4ebab0e8> Next `);
            _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent));
            _push(`</button></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</section>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(showEdit)) {
            _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-4ebab0e8><div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" data-v-4ebab0e8></div><div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-slate-900/20" data-v-4ebab0e8><div class="border-b border-slate-100 p-6" data-v-4ebab0e8><div class="flex items-center justify-between" data-v-4ebab0e8><div class="flex items-center gap-3" data-v-4ebab0e8><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100" data-v-4ebab0e8>`);
            _push2(ssrRenderComponent(unref(Pencil), { class: "h-4 w-4 text-amber-600" }, null, _parent));
            _push2(`</div><h2 class="text-lg font-semibold text-slate-900" data-v-4ebab0e8>Edit project</h2></div><button type="button" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" data-v-4ebab0e8>`);
            _push2(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
            _push2(`</button></div></div><form class="p-6 space-y-4" data-v-4ebab0e8>`);
            if (unref(editError)) {
              _push2(`<div class="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700" data-v-4ebab0e8>`);
              _push2(ssrRenderComponent(unref(AlertCircle), { class: "h-4 w-4 mt-0.5 flex-shrink-0" }, null, _parent));
              _push2(`<span data-v-4ebab0e8>${ssrInterpolate(unref(editError))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-1.5" data-v-4ebab0e8><label for="edit-name" class="block text-sm font-medium text-slate-700" data-v-4ebab0e8>Project name</label><input id="edit-name"${ssrRenderAttr("value", unref(editName))} type="text" required class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors" data-v-4ebab0e8></div><div class="space-y-1.5" data-v-4ebab0e8><label for="edit-description" class="block text-sm font-medium text-slate-700" data-v-4ebab0e8>Description</label><textarea id="edit-description" rows="3" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors resize-none" data-v-4ebab0e8>${ssrInterpolate(unref(editDescription))}</textarea></div><div class="flex justify-end gap-2 pt-2" data-v-4ebab0e8><button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" data-v-4ebab0e8>Cancel</button><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-600 hover:to-violet-700 disabled:opacity-60 transition-all" data-v-4ebab0e8>`);
            if (unref(saving)) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "h-3.5 w-3.5 animate-spin" }, null, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(unref(saving) ? "Saving..." : "Save changes")}</button></div></form></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(showAddTask)) {
            _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-4ebab0e8><div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" data-v-4ebab0e8></div><div class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl shadow-slate-900/20" data-v-4ebab0e8><div class="border-b border-slate-100 p-6" data-v-4ebab0e8><div class="flex items-center justify-between" data-v-4ebab0e8><div class="flex items-center gap-3" data-v-4ebab0e8><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100" data-v-4ebab0e8>`);
            _push2(ssrRenderComponent(unref(Plus), { class: "h-5 w-5 text-indigo-600" }, null, _parent));
            _push2(`</div><h2 class="text-lg font-semibold text-slate-900" data-v-4ebab0e8>Add task</h2></div><button type="button" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" data-v-4ebab0e8>`);
            _push2(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
            _push2(`</button></div></div>`);
            _push2(ssrRenderComponent(_component_TaskForm, {
              "project-id": unref(projectId),
              onSaved: onTaskSaved,
              onCancel: ($event) => showAddTask.value = false
            }, null, _parent));
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(editingTask)) {
            _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-4ebab0e8><div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" data-v-4ebab0e8></div><div class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl shadow-slate-900/20" data-v-4ebab0e8><div class="border-b border-slate-100 p-6" data-v-4ebab0e8><div class="flex items-center justify-between" data-v-4ebab0e8><div class="flex items-center gap-3" data-v-4ebab0e8><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100" data-v-4ebab0e8>`);
            _push2(ssrRenderComponent(unref(Pencil), { class: "h-4 w-4 text-amber-600" }, null, _parent));
            _push2(`</div><h2 class="text-lg font-semibold text-slate-900" data-v-4ebab0e8>Edit task</h2></div><button type="button" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" data-v-4ebab0e8>`);
            _push2(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
            _push2(`</button></div></div>`);
            _push2(ssrRenderComponent(_component_TaskForm, {
              "project-id": unref(projectId),
              task: unref(editingTask),
              onSaved: onTaskUpdated,
              onCancel: ($event) => editingTask.value = null
            }, null, _parent));
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(viewingTask)) {
            _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-4ebab0e8><div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" data-v-4ebab0e8></div><div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-slate-900/20" data-v-4ebab0e8><div class="border-b border-slate-100 p-6" data-v-4ebab0e8><div class="flex items-center justify-between" data-v-4ebab0e8><h2 class="text-lg font-semibold text-slate-900" data-v-4ebab0e8>Task details</h2><button type="button" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" data-v-4ebab0e8>`);
            _push2(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
            _push2(`</button></div></div><div class="p-6 space-y-4" data-v-4ebab0e8><div data-v-4ebab0e8><p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1" data-v-4ebab0e8>Title</p><p class="text-base font-semibold text-slate-900" data-v-4ebab0e8>${ssrInterpolate(unref(viewingTask).title)}</p></div>`);
            if (unref(viewingTask).description) {
              _push2(`<div data-v-4ebab0e8><p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1" data-v-4ebab0e8>Description</p><p class="text-sm text-slate-700 whitespace-pre-wrap" data-v-4ebab0e8>${ssrInterpolate(unref(viewingTask).description)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex gap-3" data-v-4ebab0e8><div data-v-4ebab0e8><p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5" data-v-4ebab0e8>Status</p><span class="${ssrRenderClass([statusBadgeClass(unref(viewingTask).status), "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold"])}" data-v-4ebab0e8>${ssrInterpolate(statusLabel(unref(viewingTask).status))}</span></div><div data-v-4ebab0e8><p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5" data-v-4ebab0e8>Priority</p><span class="${ssrRenderClass([priorityBadgeClass(unref(viewingTask).priority), "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"])}" data-v-4ebab0e8>`);
            if (unref(viewingTask).priority === "high") {
              _push2(ssrRenderComponent(unref(Flame), { class: "h-3 w-3" }, null, _parent));
            } else if (unref(viewingTask).priority === "medium") {
              _push2(ssrRenderComponent(unref(Minus), { class: "h-3 w-3" }, null, _parent));
            } else {
              _push2(ssrRenderComponent(unref(ArrowDown), { class: "h-3 w-3" }, null, _parent));
            }
            _push2(` ${ssrInterpolate(unref(viewingTask).priority)}</span></div></div>`);
            if (unref(viewingTask).due_date) {
              _push2(`<div data-v-4ebab0e8><p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1" data-v-4ebab0e8>Due date</p><div class="inline-flex items-center gap-1.5 text-sm text-slate-700" data-v-4ebab0e8>`);
              _push2(ssrRenderComponent(unref(CalendarDays), { class: "h-4 w-4 text-slate-400" }, null, _parent));
              _push2(` ${ssrInterpolate(formatDueDate(unref(viewingTask).due_date))}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="border-t border-slate-100 p-4 flex justify-end gap-2" data-v-4ebab0e8><button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" data-v-4ebab0e8> Close </button><button type="button" class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors" data-v-4ebab0e8>`);
            _push2(ssrRenderComponent(unref(Pencil), { class: "h-3.5 w-3.5" }, null, _parent));
            _push2(` Edit </button></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        if (unref(showDeleteProjectModal)) {
          _push(ssrRenderComponent(_component_ConfirmModal, {
            title: "Delete project",
            message: "Are you sure you want to delete this project and all its tasks? This action cannot be undone.",
            "confirm-label": "Delete project",
            loading: unref(deletingProject),
            onConfirm: doDeleteProject,
            onCancel: ($event) => showDeleteProjectModal.value = false
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(taskToDelete) !== null) {
          _push(ssrRenderComponent(_component_ConfirmModal, {
            title: "Delete task",
            message: "Are you sure you want to delete this task? This action cannot be undone.",
            "confirm-label": "Delete task",
            loading: unref(deletingTask),
            onConfirm: doDeleteTask,
            onCancel: ($event) => taskToDelete.value = null
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4ebab0e8"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-C2nsf9IL.mjs.map
