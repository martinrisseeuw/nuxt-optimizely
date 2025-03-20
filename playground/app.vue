<template>
  <div>
    <OptimizelyFeatureTest
      experiment-key="optimizely_debug_test"
      feature-key="optimizely_debug_test"
    >
      <template #variation_1>
        <button class="button button--variation-1">
          🎉 Variation_1 loaded
        </button>
      </template>

      <template #variation_2>
        <button class="button button--variation-2">
          🎉 Variation_2 loaded
        </button>
      </template>

      <template #default>
        <button class="button">
          🚀 Default loaded
        </button>
      </template>
    </OptimizelyFeatureTest>
  </div>
</template>

<script setup>
const { variation } = useOptimizely({
  experimentKey: 'optimizely_debug_test',
  userAttributes: {},
})

console.log(variation)
</script>

<style scoped>
.button {
  padding: 16px 24px;
  border-radius: 5px;
  border: none;
  background-color: blue;
  color: #fff;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button--variation-1 {
  background-color: #1d7c6b;

}

.button--variation-2 {
  background-color: rgb(131, 37, 189);
}
</style>
