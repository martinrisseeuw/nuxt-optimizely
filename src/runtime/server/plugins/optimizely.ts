import { createInstance, enums } from '@optimizely/optimizely-sdk'
import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import type { Client } from '@optimizely/optimizely-sdk'

export default defineNitroPlugin((nitroApp) => {
  let client: Client | null = null
  try {
    client = createInstance({
      sdkKey: useRuntimeConfig().myModule.accessKey,
      logLevel: enums.LOG_LEVEL.DEBUG,
      datafileOptions: {
        autoUpdate: true,
        updateInterval: 1000 * 60,
      },
    })

    client?.notificationCenter.addNotificationListener(
      enums.NOTIFICATION_TYPES.OPTIMIZELY_CONFIG_UPDATE,
      () => {
        const newConfig = client?.getOptimizelyConfig()
        console.log(`[OptimizelyConfig] revision = ${newConfig?.revision}`)
      },
    )
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
