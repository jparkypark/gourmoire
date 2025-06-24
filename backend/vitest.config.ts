import { defineConfig } from 'vitest/config'
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    watch: {
      clearScreen: false,
    },
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
      },
    },
    alias: {
      'bcryptjs': './src/test/stubs/bcryptjs.ts',
    },
    coverage: {
      enabled: false, // Disable coverage for Workers environment due to node:inspector compatibility issues
      // TODO: Re-enable once vitest-pool-workers supports v8 coverage properly
    },
  },
})