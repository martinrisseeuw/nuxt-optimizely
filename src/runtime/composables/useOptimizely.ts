import type { UserAttributes } from '@optimizely/optimizely-sdk'
import { getVariation } from '../utils/get-variation'
import { useUserId } from './useUserId'
import { useNuxtApp, useRoute } from '#app'

export function useOptimizely({
  experimentKey,
  userAttributes,
  featureKey,
}: {
  experimentKey: string
  featureKey?: string
  userAttributes?: UserAttributes
}) {
  const route = useRoute()
  const { $optimizely } = useNuxtApp()
  const userId = useUserId()

  // If the plugin is not enabled, return null values
  if (!$optimizely) {
    return {
      variation: null,
      variables: null,
    }
  }

  const variation = getVariation({
    experimentKey: experimentKey,
    userId: userId.value,
    userAttributes: userAttributes,
    query: route.query,
    optimizely: $optimizely,
  })

  const variables = featureKey && $optimizely.getAllFeatureVariables(
    featureKey,
    userId.value,
    userAttributes,
  )

  return {
    variation,
    variables: variables ?? null,
  }
}
