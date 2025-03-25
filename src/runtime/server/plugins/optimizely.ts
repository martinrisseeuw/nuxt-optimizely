import { createInstance, enums } from '@optimizely/optimizely-sdk'
import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import type { Client } from '@optimizely/optimizely-sdk'

export default defineNitroPlugin((nitroApp) => {
  let client: Client | null = null

  try {
    client = createInstance({
      sdkKey: useRuntimeConfig().public.optimizely.accessKey,
      logLevel: useRuntimeConfig().public.optimizely.logLevel || enums.LOG_LEVEL.INFO,
    })
  }
  catch (error) {
    console.error('Failed to create Optimizely client', error)
  }

  nitroApp.hooks.hook('request', (event) => {
    event.context.optimizely = client
  })

  nitroApp.hooks.hook('close', async () => {
    client?.close()
  })
})
