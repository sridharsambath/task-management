import { _ as __nuxt_component_0 } from './nuxt-link-DMl0X9B3.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { CheckSquare, AlertCircle, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-vue-next';
import { u as useAuth, a as useRouter } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    useRouter();
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const error = ref("");
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-[calc(100vh-4rem)] items-center justify-center py-12" }, _attrs))}><div class="w-full max-w-md"><div class="mb-8 text-center"><div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 mb-4">`);
      _push(ssrRenderComponent(unref(CheckSquare), { class: "h-7 w-7 text-white" }, null, _parent));
      _push(`</div><h1 class="text-2xl font-bold text-slate-900">Welcome back</h1><p class="mt-1 text-sm text-slate-500">Sign in to continue to TaskFlow</p></div><div class="rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-xl shadow-slate-200/50 p-8"><form class="space-y-5">`);
      if (unref(error)) {
        _push(`<div class="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-700">`);
        _push(ssrRenderComponent(unref(AlertCircle), { class: "h-4 w-4 mt-0.5 flex-shrink-0" }, null, _parent));
        _push(`<span>${ssrInterpolate(unref(error))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-1.5"><label for="email" class="block text-sm font-medium text-slate-700">Email address</label><div class="relative"><div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">`);
      _push(ssrRenderComponent(unref(Mail), { class: "h-4 w-4 text-slate-400" }, null, _parent));
      _push(`</div><input id="email"${ssrRenderAttr("value", unref(email))} type="email" required autocomplete="email" placeholder="you@example.com" class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"></div></div><div class="space-y-1.5"><label for="password" class="block text-sm font-medium text-slate-700">Password</label><div class="relative"><div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">`);
      _push(ssrRenderComponent(unref(Lock), { class: "h-4 w-4 text-slate-400" }, null, _parent));
      _push(`</div><input id="password"${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} required autocomplete="current-password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" class="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"><button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600">`);
      if (!unref(showPassword)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-4 w-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-4 w-4" }, null, _parent));
      }
      _push(`</button></div></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all">`);
      if (unref(loading)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(unref(loading) ? "Signing in..." : "Sign in")}</span>`);
      if (!unref(loading)) {
        _push(ssrRenderComponent(unref(ArrowRight), { class: "h-4 w-4" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</button></form></div><p class="mt-6 text-center text-sm text-slate-500"> Don&#39;t have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create one `);
          } else {
            return [
              createTextVNode(" Create one ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-HJUi3Qkl.mjs.map
