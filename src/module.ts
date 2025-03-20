import { defineNuxtModule, addServerPlugin, addPlugin, addImportsDir, createResolver, addComponent } from '@nuxt/kit'

// Module options TypeScript interface definition
// export interface ModuleOptions {}

export default defineNuxtModule({
  meta: {
    name: 'nuxt-optimizely',
    configKey: 'nuxtOptimizely',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    optimizelyKey: '',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    nuxt.options.runtimeConfig.myModule = {
      accessKey: options.optimizelyKey || process.env.OPTIMIZELY_SDK_KEY || '',
    }

    addPlugin(resolver.resolve('./runtime/plugins/optimizely.client.ts'))
    addPlugin(resolver.resolve('./runtime/plugins/optimizely.server.ts'))
    addServerPlugin(resolver.resolve('./runtime/server/plugins/optimizely.ts'))
    addComponent({
      name: 'OptimizelyFeatureTest',
      filePath: resolver.resolve('./runtime/components/OptimizelyFeatureTest.vue'),
    })

    addImportsDir(resolver.resolve('./runtime/composables'))
  },
})
