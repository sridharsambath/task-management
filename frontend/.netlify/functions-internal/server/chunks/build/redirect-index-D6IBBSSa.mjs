import { d as defineNuxtRouteMiddleware, u as useAuth, n as navigateTo } from './server.mjs';
import 'vue';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const redirectIndex = defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth();
  return navigateTo(isAuthenticated.value ? "/projects" : "/login", { replace: true });
});

export { redirectIndex as default };
//# sourceMappingURL=redirect-index-D6IBBSSa.mjs.map
