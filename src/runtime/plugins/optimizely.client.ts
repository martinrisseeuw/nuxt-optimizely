import { createInstance, enums } from '@optimizely/optimizely-sdk'
import { useRuntimeConfig, useState, defineNuxtPlugin, useRoute } from 'nuxt/app'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const optimizelyDisabled = route.query.disable_optimizely === 'true' || config.public.DISABLE_OPTIMIZELY === 'true'

  if (optimizelyDisabled) return {
    provide: {
      optimizely: null,
    },
  }

  const optimizelyClient = createInstance({
    datafile: useState<object>('optimizely-datafile').value,
    logLevel: config.public.optimizely.logLevel || enums.LOG_LEVEL.INFO,
    datafileOptions: {
      autoUpdate: false,
    },
  })

  return {
    provide: {
      optimizely: optimizelyClient,
    },
  }
})
