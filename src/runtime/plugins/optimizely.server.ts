import type { Client } from '@optimizely/optimizely-sdk'
import { useState, defineNuxtPlugin, useRoute, useRuntimeConfig } from 'nuxt/app'
import { shallowRef } from 'vue'

export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const optimizelyDisabled = route.query.disable_optimizely === 'true' || config.public.DISABLE_OPTIMIZELY === 'true'

  if (optimizelyDisabled) return {
    provide: {
      optimizely: null,
    },
  }

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
