import { createInstance, enums } from '@optimizely/optimizely-sdk'
import { useRuntimeConfig, useState, defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const optimizelyClient = createInstance({
    datafile: useState<object>('optimizely-datafile').value,
    logLevel: config.public.myModule.logLevel || enums.LOG_LEVEL.INFO,
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
