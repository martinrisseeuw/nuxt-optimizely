import type { Client } from '@optimizely/optimizely-sdk'
import { useState, defineNuxtPlugin } from 'nuxt/app'
import { shallowRef } from 'vue'

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
