import { u as useAuth, c as useRuntimeConfig } from './server.mjs';

function useApi() {
  const config = useRuntimeConfig();
  const { token } = useAuth();
  function apiBase() {
    const base = config.public.apiBase;
    return base.replace(/\/$/, "");
  }
  async function api(path, options = {}) {
    const url = `${apiBase()}${path.startsWith("/") ? path : `/${path}`}`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }
    return $fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers }
    });
  }
  return { api, apiBase };
}

export { useApi as u };
//# sourceMappingURL=useApi-BmygG2T_.mjs.map
