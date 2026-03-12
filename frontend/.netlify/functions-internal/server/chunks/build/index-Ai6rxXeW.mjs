import { _ as __nuxt_component_0 } from './nuxt-link-DMl0X9B3.mjs';
import { defineComponent, ref, watch, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
import { Plus, Search, ArrowUpDown, Filter, X, AlertCircle, FolderOpen, ChevronRight, ListChecks, ChevronLeft, FolderPlus, Loader2 } from 'lucide-vue-next';
import { _ as _export_sfc, b as useRoute, a as useRouter, u as useAuth } from './server.mjs';
import { u as useApi } from './useApi-BmygG2T_.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const { api } = useApi();
    const projects = ref([]);
    const meta = ref(null);
    const loading = ref(true);
    const error = ref("");
    const showCreate = ref(false);
    const newName = ref("");
    const newDescription = ref("");
    const creating = ref(false);
    const createError = ref("");
    const searchInput = ref("");
    const sort = ref("updated_at");
    const page = ref(1);
    const perPage = ref(12);
    function initProjectFiltersFromQuery() {
      var _a;
      const q = route.query;
      searchInput.value = (_a = q.search) != null ? _a : "";
      sort.value = q.sort || "updated_at";
      page.value = Math.max(1, parseInt(q.page || "1", 10) || 1);
    }
    async function loadProjects() {
      var _a, _b;
      loading.value = true;
      error.value = "";
      try {
        const params = new URLSearchParams();
        if (searchInput.value) params.set("search", searchInput.value);
        params.set("sort", sort.value);
        params.set("page", String(page.value));
        params.set("per_page", String(perPage.value));
        const res = await api(`/api/projects?${params.toString()}`);
        if (res && typeof res === "object" && "data" in res) {
          projects.value = res.data;
          meta.value = (_a = res.meta) != null ? _a : null;
        } else {
          projects.value = Array.isArray(res) ? res : [];
          meta.value = null;
        }
      } catch (e) {
        const err = e;
        error.value = ((_b = err == null ? void 0 : err.data) == null ? void 0 : _b.message) || "Failed to load projects.";
        if ((err == null ? void 0 : err.statusCode) === 401) {
          const { logout } = useAuth();
          logout();
        }
      } finally {
        loading.value = false;
      }
    }
    watch(() => route.query, () => {
      initProjectFiltersFromQuery();
      loadProjects();
    }, { deep: true, immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-fbb513f1><div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" data-v-fbb513f1><div data-v-fbb513f1><h1 class="text-2xl font-bold text-slate-900" data-v-fbb513f1>Projects</h1><p class="mt-1 text-sm text-slate-500" data-v-fbb513f1>Manage and track all your projects in one place</p></div><button type="button" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all" data-v-fbb513f1>`);
      _push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
      _push(` New project </button></div><div class="mb-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm p-4" data-v-fbb513f1><div class="flex flex-wrap items-end gap-3" data-v-fbb513f1><div class="flex-1 min-w-[200px]" data-v-fbb513f1><label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide" data-v-fbb513f1>Search</label><div class="relative" data-v-fbb513f1><div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" data-v-fbb513f1>`);
      _push(ssrRenderComponent(unref(Search), { class: "h-4 w-4 text-slate-400" }, null, _parent));
      _push(`</div><input${ssrRenderAttr("value", unref(searchInput))} type="search" placeholder="Search by name or description..." class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors" data-v-fbb513f1></div></div><div data-v-fbb513f1><label class="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wide" data-v-fbb513f1>Sort by</label><div class="relative" data-v-fbb513f1><div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" data-v-fbb513f1>`);
      _push(ssrRenderComponent(unref(ArrowUpDown), { class: "h-3.5 w-3.5 text-slate-400" }, null, _parent));
      _push(`</div><select class="appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-8 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors" data-v-fbb513f1><option value="updated_at" data-v-fbb513f1${ssrIncludeBooleanAttr(Array.isArray(unref(sort)) ? ssrLooseContain(unref(sort), "updated_at") : ssrLooseEqual(unref(sort), "updated_at")) ? " selected" : ""}>Newest first</option><option value="updated_at_asc" data-v-fbb513f1${ssrIncludeBooleanAttr(Array.isArray(unref(sort)) ? ssrLooseContain(unref(sort), "updated_at_asc") : ssrLooseEqual(unref(sort), "updated_at_asc")) ? " selected" : ""}>Oldest first</option><option value="name" data-v-fbb513f1${ssrIncludeBooleanAttr(Array.isArray(unref(sort)) ? ssrLooseContain(unref(sort), "name") : ssrLooseEqual(unref(sort), "name")) ? " selected" : ""}>Name A\u2013Z</option><option value="name_desc" data-v-fbb513f1${ssrIncludeBooleanAttr(Array.isArray(unref(sort)) ? ssrLooseContain(unref(sort), "name_desc") : ssrLooseEqual(unref(sort), "name_desc")) ? " selected" : ""}>Name Z\u2013A</option><option value="created_at" data-v-fbb513f1${ssrIncludeBooleanAttr(Array.isArray(unref(sort)) ? ssrLooseContain(unref(sort), "created_at") : ssrLooseEqual(unref(sort), "created_at")) ? " selected" : ""}>Created (newest)</option><option value="created_at_asc" data-v-fbb513f1${ssrIncludeBooleanAttr(Array.isArray(unref(sort)) ? ssrLooseContain(unref(sort), "created_at_asc") : ssrLooseEqual(unref(sort), "created_at_asc")) ? " selected" : ""}>Created (oldest)</option></select></div></div><div class="flex gap-2" data-v-fbb513f1><button type="button" class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors" data-v-fbb513f1>`);
      _push(ssrRenderComponent(unref(Filter), { class: "h-3.5 w-3.5" }, null, _parent));
      _push(` Apply </button><button type="button" class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" data-v-fbb513f1>`);
      _push(ssrRenderComponent(unref(X), { class: "h-3.5 w-3.5" }, null, _parent));
      _push(` Reset </button></div></div></div>`);
      if (unref(loading)) {
        _push(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-fbb513f1><!--[-->`);
        ssrRenderList(6, (i) => {
          _push(`<div class="animate-pulse rounded-2xl bg-white/60 border border-slate-100 p-6 h-40" data-v-fbb513f1></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(error)) {
        _push(`<div class="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 p-5 text-red-700" data-v-fbb513f1>`);
        _push(ssrRenderComponent(unref(AlertCircle), { class: "h-5 w-5 mt-0.5 flex-shrink-0" }, null, _parent));
        _push(`<p data-v-fbb513f1>${ssrInterpolate(unref(error))}</p></div>`);
      } else {
        _push(`<!--[--><div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-fbb513f1><!--[-->`);
        ssrRenderList(unref(projects), (project) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: project.id,
            to: `/projects/${project.id}`,
            class: "group relative flex flex-col rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-6"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
              if (_push2) {
                _push2(`<div class="mb-3 flex items-start justify-between" data-v-fbb513f1${_scopeId}><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 group-hover:from-indigo-200 group-hover:to-violet-200 transition-colors" data-v-fbb513f1${_scopeId}>`);
                _push2(ssrRenderComponent(unref(FolderOpen), { class: "h-5 w-5 text-indigo-600" }, null, _parent2, _scopeId));
                _push2(`</div>`);
                _push2(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all mt-1" }, null, _parent2, _scopeId));
                _push2(`</div><h2 class="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1" data-v-fbb513f1${_scopeId}>${ssrInterpolate(project.name)}</h2>`);
                if (project.description) {
                  _push2(`<p class="mt-1 text-sm text-slate-500 line-clamp-2" data-v-fbb513f1${_scopeId}>${ssrInterpolate(project.description)}</p>`);
                } else {
                  _push2(`<p class="mt-1 text-sm text-slate-400 italic" data-v-fbb513f1${_scopeId}>No description</p>`);
                }
                _push2(`<div class="mt-auto pt-4 flex items-center gap-1.5" data-v-fbb513f1${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ListChecks), { class: "h-3.5 w-3.5 text-slate-400" }, null, _parent2, _scopeId));
                _push2(`<span class="text-xs text-slate-500 font-medium" data-v-fbb513f1${_scopeId}>${ssrInterpolate((_c = (_b2 = project.tasks_count) != null ? _b2 : (_a2 = project.tasks) == null ? void 0 : _a2.length) != null ? _c : 0)} task${ssrInterpolate(((_f = (_e = project.tasks_count) != null ? _e : (_d = project.tasks) == null ? void 0 : _d.length) != null ? _f : 0) === 1 ? "" : "s")}</span></div>`);
              } else {
                return [
                  createVNode("div", { class: "mb-3 flex items-start justify-between" }, [
                    createVNode("div", { class: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 group-hover:from-indigo-200 group-hover:to-violet-200 transition-colors" }, [
                      createVNode(unref(FolderOpen), { class: "h-5 w-5 text-indigo-600" })
                    ]),
                    createVNode(unref(ChevronRight), { class: "h-4 w-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all mt-1" })
                  ]),
                  createVNode("h2", { class: "font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1" }, toDisplayString(project.name), 1),
                  project.description ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-sm text-slate-500 line-clamp-2"
                  }, toDisplayString(project.description), 1)) : (openBlock(), createBlock("p", {
                    key: 1,
                    class: "mt-1 text-sm text-slate-400 italic"
                  }, "No description")),
                  createVNode("div", { class: "mt-auto pt-4 flex items-center gap-1.5" }, [
                    createVNode(unref(ListChecks), { class: "h-3.5 w-3.5 text-slate-400" }),
                    createVNode("span", { class: "text-xs text-slate-500 font-medium" }, toDisplayString((_i = (_h = project.tasks_count) != null ? _h : (_g = project.tasks) == null ? void 0 : _g.length) != null ? _i : 0) + " task" + toDisplayString(((_l = (_k = project.tasks_count) != null ? _k : (_j = project.tasks) == null ? void 0 : _j.length) != null ? _l : 0) === 1 ? "" : "s"), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]-->`);
        if (unref(projects).length === 0) {
          _push(`<div class="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center" data-v-fbb513f1><div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100" data-v-fbb513f1>`);
          _push(ssrRenderComponent(unref(FolderOpen), { class: "h-8 w-8 text-slate-400" }, null, _parent));
          _push(`</div><h3 class="text-base font-semibold text-slate-700" data-v-fbb513f1>${ssrInterpolate(unref(searchInput) || unref(sort) !== "updated_at" ? "No matching projects" : "No projects yet")}</h3><p class="mt-1 text-sm text-slate-500" data-v-fbb513f1>${ssrInterpolate(unref(searchInput) || unref(sort) !== "updated_at" ? "Try adjusting your filters." : "Create your first project to get started.")}</p>`);
          if (!unref(searchInput) && unref(sort) === "updated_at") {
            _push(`<button type="button" class="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors" data-v-fbb513f1>`);
            _push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
            _push(` New project </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(meta) && unref(meta).last_page > 1) {
          _push(`<div class="mt-6 flex flex-wrap items-center justify-between gap-3" data-v-fbb513f1><p class="text-sm text-slate-500" data-v-fbb513f1> Showing <span class="font-medium text-slate-700" data-v-fbb513f1>${ssrInterpolate((_a = unref(meta).from) != null ? _a : 0)}\u2013${ssrInterpolate((_b = unref(meta).to) != null ? _b : 0)}</span> of <span class="font-medium text-slate-700" data-v-fbb513f1>${ssrInterpolate(unref(meta).total)}</span> projects </p><div class="flex items-center gap-1" data-v-fbb513f1><button type="button" class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"${ssrIncludeBooleanAttr(unref(meta).current_page <= 1) ? " disabled" : ""} data-v-fbb513f1>`);
          _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent));
          _push(` Previous </button><span class="px-3 py-1.5 text-sm text-slate-500" data-v-fbb513f1>${ssrInterpolate(unref(meta).current_page)} / ${ssrInterpolate(unref(meta).last_page)}</span><button type="button" class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"${ssrIncludeBooleanAttr(unref(meta).current_page >= unref(meta).last_page) ? " disabled" : ""} data-v-fbb513f1> Next `);
          _push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent));
          _push(`</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showCreate)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-fbb513f1><div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" data-v-fbb513f1></div><div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-slate-900/20" data-v-fbb513f1><div class="border-b border-slate-100 p-6" data-v-fbb513f1><div class="flex items-center justify-between" data-v-fbb513f1><div class="flex items-center gap-3" data-v-fbb513f1><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100" data-v-fbb513f1>`);
          _push2(ssrRenderComponent(unref(FolderPlus), { class: "h-5 w-5 text-indigo-600" }, null, _parent));
          _push2(`</div><h2 class="text-lg font-semibold text-slate-900" data-v-fbb513f1>New project</h2></div><button type="button" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" data-v-fbb513f1>`);
          _push2(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
          _push2(`</button></div></div><form class="p-6 space-y-4" data-v-fbb513f1>`);
          if (unref(createError)) {
            _push2(`<div class="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700" data-v-fbb513f1>`);
            _push2(ssrRenderComponent(unref(AlertCircle), { class: "h-4 w-4 mt-0.5 flex-shrink-0" }, null, _parent));
            _push2(`<span data-v-fbb513f1>${ssrInterpolate(unref(createError))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="space-y-1.5" data-v-fbb513f1><label for="name" class="block text-sm font-medium text-slate-700" data-v-fbb513f1>Project name <span class="text-red-400" data-v-fbb513f1>*</span></label><input id="name"${ssrRenderAttr("value", unref(newName))} type="text" required placeholder="e.g. Website Redesign" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors" data-v-fbb513f1></div><div class="space-y-1.5" data-v-fbb513f1><label for="description" class="block text-sm font-medium text-slate-700" data-v-fbb513f1>Description <span class="text-slate-400 font-normal" data-v-fbb513f1>(optional)</span></label><textarea id="description" rows="3" placeholder="What is this project about?" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors resize-none" data-v-fbb513f1>${ssrInterpolate(unref(newDescription))}</textarea></div><div class="flex justify-end gap-2 pt-2" data-v-fbb513f1><button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" data-v-fbb513f1> Cancel </button><button type="submit"${ssrIncludeBooleanAttr(unref(creating)) ? " disabled" : ""} class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-600 hover:to-violet-700 disabled:opacity-60 transition-all" data-v-fbb513f1>`);
          if (unref(creating)) {
            _push2(ssrRenderComponent(unref(Loader2), { class: "h-3.5 w-3.5 animate-spin" }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(` ${ssrInterpolate(unref(creating) ? "Creating..." : "Create project")}</button></div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fbb513f1"]]);

export { index as default };
//# sourceMappingURL=index-Ai6rxXeW.mjs.map
