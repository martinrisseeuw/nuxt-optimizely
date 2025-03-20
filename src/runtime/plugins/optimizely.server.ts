import type { Client } from '@optimizely/optimizely-sdk'

export default defineNuxtPlugin(async (nuxtApp) => {
  const client: Client | null = nuxtApp.ssrContext?.event?.context?.optimizely || null

  useState<object>('optimizely-datafile', () =>
    shallowRef(client?.getOptimizelyConfig()?.getDatafile() || {}),
  )

  return {
    provide: {
      optimizely: client,
    },
  }
})
