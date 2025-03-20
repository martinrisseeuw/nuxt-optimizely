<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nuxt Optimizely Module
- Package name: nuxt-optimizely
- Description: My new Nuxt module
-->

# Nuxt Optimizely Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt optimizely module for A/B feature testing.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

<!-- Highlight some of the features your module provide here -->

- useOptimizely composable for getting the active feature
- OptimizelyFeatureTest helper component for rendering features in slots

## Quick Setup

```bash
npx nuxi module add nuxt-optimizely
```

```js
export default defineNuxtConfig({
  nuxtOptimizely: {
    optimizelyKey: 'your-optimizely-key',
    logLevel: 'INFO' // NOTSET, DEBUG, INFO, WARNING, ERROR
  },
});
```

That's it! You can now use Nuxt Optimizely Module in your Nuxt app ✨

# How it works

Nuxt Optimizely contains a single Vue component and composable that allows you to get the current test variation for a running experiment. It also allows you to get the variables that are configured for the test. It's a simple wrapper around `@optimizely/optimizely-sdk` for easy use in our projects. It manages getting/setting a unique user ID for experiment bucketing. For advanced use cases, the composable also provides access to the full Optimizely SDK.

### Simple Usage

#### Vue component

The easiest way to integrate an AB test is by adding the `OptimizelyFeatureTest` component in your template where you want the AB test to appear. Don't forget to replace `experiment_key` with the [Optimizely experiment key](https://docs.developers.optimizely.com/full-stack-experimentation/docs/run-feature-tests) for your AB test.

```html
<optimizely-feature-test experiment-key="experiment_key">
  <template #variation_1> Test Variant ✨ </template>
  <template #default> Test Default </template>
</optimizely-feature-test>
```

OR

```html
<optimizely-feature-test experiment-key="experiment_key">
  <template #variation_1> Test Variant ✨ </template>
  <template #control> Test Control </template>
</optimizely-feature-test>
```

#### Composable

Another way to integrate an AB test is by using the built-in composable to get the variation of an experiment using a [Optimizely experiment key](https://docs.developers.optimizely.com/full-stack-experimentation/docs/run-feature-tests).
`const { variation: myABTestVariation } = useOptimizely({experimentKey: 'experiment_key'})`

Now, `myABTestVariation` is either the variation key (e.g: `variation_1`) or `null`. The value can be `null` when either the user doesn't qualify for the experiment audience, or when the AB test isn't running. If you pass `optimizely_log=true` in the URL, the Optimizely SDK will output logs in the console to inform you whether the user qualifies for the experiment or not.

In your template, you can render the experiment like this:

```html
<div class="my-experiment-variation" v-if="myABTestVariation === 'variation_1'">
  Test Variant ✨
</div>
<div class="my-experiment-control" v-else>Test Control</div>
```

### Get a forced variation for an AB Test

During testing, it is useful to toggle between variations manually. You can do that like this:
`https://yoursite.com/?optimizely_force_variation[experiment_key]=variation_1`
Forced variations will not send impressions to Optimizely.

### Get variables for an AB Test

#### Vue component

The component allows you to retrieve and directly use variables for an AB test. For this, you will additionally need to provide the feature key. It works by using Vue [Named Scoped Slots](https://vuejs.org/guide/components/slots.html#scoped-slots) to expose the variables to your template.

```html
<optimizely-feature-test
  experiment-key="your_experiment_key"
  feature-key="your_feature_key"
>
  <template #variation_1="{ variables }">
    Test Variant ✨

    <ul>
      <li v-for="(variable, variableKey) in variables" :key="variableKey">
        {{ variableKey }}: {{ variable }}
      </li>
    </ul>
  </template>
  <template #default="{ variables }">
    Test Control

    <ul>
      <li v-for="(variable, variableKey) in variables" :key="variableKey">
        {{ variableKey }}: {{ variable }}
      </li>
    </ul>
  </template>
</optimizely-feature-test>
```

#### Composable

The composable allows you to retrieve variables for an AB test, as configured in the Optimizely web-app. For this, you will additionally need to provide the feature key.

```js
const { variables: myABTestVariables } = useOptimizely({ experimentKey: 'experiment_key', featureKey: 'feature_key' })

<div class="my-experiment-price">{{myAbTestVariables.price}}</div>
```

### Override the default audience attributes to ensure correct experiment bucketing (Advanced)

Before Optimizely decides whether to show a variation or control, it first checks whether the user qualifies for the experiment based on the configured audience for a given experiment.The audience is made up of user attributes defined in optimzely.
**Important**: It's important to know that audience attributes are initialised _once_ when the user enters the Nuxt website. They are not automatically updated during client side navigation. So if your experiment should run for a specific audience attribute that may change during client-side navigation , you should make sure this is evaluated when you call `useOptimizely` like this:

#### Vue component

```html
<optimizely-feature-test
  experiment-key="experiment_key"
  :attributes="{ new: attribute }"
>
  <template #variation_1> Test Variant ✨ </template>
  <template #default> Test Control </template>
</optimizely-feature-test>
```

#### Composable

```js
const { variation: myABTestVariation } = useOptimizely({
  experimentKey: "experiment_key",
  attributes: { key: value },
});
```

If you don't provide the correct audience attributes, it could lead to experiments being rendered incorrectly in cases like this: The user lands on a Libelle page with an AB test, for which he is shown the variation. He navigates to Autoweek, which is not part of the experiment audience. Because the attributes are not updated, the user gets shown a variation, even though he should not.

### How unique user tracking works

Optimizely uses a unique user ID to perform bucketing. Getting and setting the user IDs is taken care of by this layer. It sets a cookie `optimizely-user-id` with a UUID. For returning visitors, this user ID is reused.
If you want to clear the user, simply clear your cookies.

## Lifecycle

To understand how this layer works, here's the steps it performs from Nuxt session startup to the user viewing an AB test.

1. Server: The Optimizely SDK is initialised using the plugin of this layer. The SDK downloads a small JSON datafile, containing info about all running experiments.
2. Server: A so-called user context is created with a unique ID coming from the cookie, or a newly generated UUID. The context also includes the attributes for the audience.

Once the page rendering starts and `useOptimizely` is called:

3. Server: `getVariation` is called, and user is qualified and bucketed in the right experiment variation. This ensures we pre-render the right variation.
4. Client: `activate` is called, and user is qualified and bucketed in the right experiment variation. It also sends the impression event to Optimizely, as part of the client-side page rendering.
5. Client: The notification listener forwards the bucketing decision to the analytics service.

When the user client-side navigates to another page, step 4 and 5 are repeated for the AB tests on that new page.

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-optimizely/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-optimizely
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-optimizely.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-optimizely
[license-src]: https://img.shields.io/npm/l/nuxt-optimizely.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-optimizely
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
