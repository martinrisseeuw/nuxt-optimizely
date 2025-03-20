import type { LocationQuery } from 'vue-router'
import type { Client, UserAttributes } from '@optimizely/optimizely-sdk'

export function getVariation(
  {
    experimentKey,
    userId,
    userAttributes,
    query,
    optimizely,
  }: {
    experimentKey: string
    userId: string
    query: LocationQuery
    optimizely: Client
    userAttributes?: UserAttributes
  },
) {
  const forceQuery = query[`optimizely_force_variation[${experimentKey}]`]
  const forcedVariationRouteQuery
    = typeof forceQuery === 'string' ? forceQuery : null

  if (forcedVariationRouteQuery) {
    optimizely.setForcedVariation(
      experimentKey,
      userId,
      forcedVariationRouteQuery,
    )

    return optimizely.getForcedVariation(experimentKey, userId)
  }

  return optimizely.getVariation(experimentKey, userId, userAttributes) ?? null
}
