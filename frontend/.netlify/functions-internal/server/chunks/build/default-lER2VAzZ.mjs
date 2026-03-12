import { _ as __nuxt_component_0 } from './nuxt-link-DMl0X9B3.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { CheckSquare, LogOut } from 'lucide-vue-next';
import { u as useAuth } from './server.mjs';
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
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { user, isAuthenticated } = useAuth();
    const userInitial = computed(() => {
      if (!user.value) return "?";
      const name = user.value.name || user.value.email || "";
      return name.charAt(0).toUpperCase();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" }, _attrs))}>`);
      if (unref(isAuthenticated)) {
        _push(`<header class="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-sm"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="flex h-16 items-center justify-between">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/projects",
          class: "flex items-center gap-2.5 group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md group-hover:shadow-indigo-200 transition-shadow"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(CheckSquare), { class: "h-4 w-4 text-white" }, null, _parent2, _scopeId));
              _push2(`</div><span class="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"${_scopeId}> TaskFlow </span>`);
            } else {
              return [
                createVNode("div", { class: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md group-hover:shadow-indigo-200 transition-shadow" }, [
                  createVNode(unref(CheckSquare), { class: "h-4 w-4 text-white" })
                ]),
                createVNode("span", { class: "text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent" }, " TaskFlow ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex items-center gap-3"><div class="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5"><div class="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center"><span class="text-xs font-bold text-white">${ssrInterpolate(unref(userInitial))}</span></div><span class="text-sm font-medium text-slate-700">${ssrInterpolate(unref(user) ? unref(user).name || unref(user).email || "\u2014" : "Loading...")}</span></div><button type="button" class="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm">`);
        _push(ssrRenderComponent(unref(LogOut), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(`<span class="hidden sm:inline">Sign out</span></button></div></div></div></header>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-lER2VAzZ.mjs.map
