import { createInstance, enums } from '@optimizely/optimizely-sdk'

export default defineNuxtPlugin(async () => {
  const optimizelyClient = createInstance({
    datafile: useState<object>('optimizely-datafile').value,
    logLevel: enums.LOG_LEVEL.ERROR,
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
