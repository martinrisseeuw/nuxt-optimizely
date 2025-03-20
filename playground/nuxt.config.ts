export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-03-20',
  nuxtOptimizely: {
    optimizelyKey: import.meta.env.OPTIMIZELY_SDK_KEY,
  },
})
