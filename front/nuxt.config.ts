// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt'
  ],
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.min.css'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Replace with the actual path to your variables file
          additionalData: '@use "~/scss/_variables.scss" as *;'
        }
      }
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_URL || '',
      apiRedirectUrl: process.env.REDIRECT_API_URL || '',
      clientId: process.env.CLIENT_ID || ''
    }
  }
})
