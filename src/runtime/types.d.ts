import type { Client } from '@optimizely/optimizely-sdk'

export {}

type Module = Client | null

declare module '#app' {
  interface NuxtApp {
    $optimizely: Module
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $optimizely: Module
  }
}
