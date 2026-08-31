import { defineConfig } from 'vitest/config'

// The app is served from https://slejer99.github.io/budget_app/, so every asset
// URL it emits has to carry that prefix. `base` is the only place that lives.
const BASE = '/budget_app/'

export default defineConfig({
  base: BASE,
  // Preact's JSX, without a plugin: esbuild compiles `<div/>` straight to
  // `jsx()` imported from `preact/jsx-runtime`.
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'preact',
  },
  build: {
    target: 'es2022',
  },
  test: {
    // The budget core is pure — no DOM, so no DOM environment to set up.
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
