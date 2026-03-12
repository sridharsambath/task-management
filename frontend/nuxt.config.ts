// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  nitro: {
    // Use Netlify's serverless-functions preset when building on Netlify CI.
    // Falls back to the default Node server preset for local dev.
    preset: process.env.NETLIFY ? 'netlify' : undefined,
  },

  runtimeConfig: {
    // Server-only — never exposed to the browser
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
    },
  },

  app: {
    head: {
      title: 'TaskFlow — Task Management',
      meta: [
        { name: 'description', content: 'Manage your projects and tasks with AI assistance powered by Claude.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },
})
