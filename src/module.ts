import { defineNuxtModule, addServerPlugin, addPlugin, addImportsDir, createResolver, addComponent } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
  optimizelyKey: string
  logLevel: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-optimizely',
    configKey: 'nuxtOptimizely',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    optimizelyKey: process.env.OPTIMIZELY_SDK_KEY || '',
    logLevel: 'DEBUG',
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.optimizely = {
      accessKey: options.optimizelyKey,
      logLevel: options.logLevel,
    }

    addPlugin(resolver.resolve('./runtime/plugins/optimizely.client'))
    addPlugin(resolver.resolve('./runtime/plugins/optimizely.server'))
    addServerPlugin(resolver.resolve('./runtime/server/plugins/optimizely'))
    addComponent({
      name: 'OptimizelyFeatureTest',
      filePath: resolver.resolve('./runtime/components/OptimizelyFeatureTest'),
    })

    addImportsDir(resolver.resolve('./runtime/composables'))

    nuxt.hook('nitro:config', (nitroConfig) => {
      if (nitroConfig.runtimeConfig?.public) {
        // merge runtime options into nitro
        nitroConfig.runtimeConfig.public = { ...nitroConfig.runtimeConfig.public, options }
      }
    })
  },
})
