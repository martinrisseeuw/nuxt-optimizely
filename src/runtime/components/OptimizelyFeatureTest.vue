<script setup lang="ts">
import type { UserAttributes } from '@optimizely/optimizely-sdk'
import { useOptimizely } from '../composables/useOptimizely'

const props = defineProps<{
  experimentKey: string
  featureKey: string
  userAttributes?: UserAttributes
}>()

const { variation: abTestVariation, variables: abTestVariables } = useOptimizely({
  experimentKey: props.experimentKey,
  featureKey: props.featureKey,
  userAttributes: props.userAttributes,
})
</script>

<template>
  <slot
    v-if="abTestVariation && abTestVariation !== 'control'"
    :name="abTestVariation"
    :variables="abTestVariables"
  />
  <slot
    v-else
    :variables="abTestVariables"
  />
</template>
