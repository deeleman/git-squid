/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import { generateGitSquidKeysPlugin } from './plugins'

export default defineConfig(({ command }) => ({
  main: {
    envPrefix: 'SQUID_MAIN',
    plugins: [externalizeDepsPlugin(), generateGitSquidKeysPlugin(command)],
    build: {
      copyPublicDir: true
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  },
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul', // or 'v8'
      exclude: [
        'out/**',
        '**/main/index.ts',
        '**/preload/index.ts',
        '**/renderer/src/main.tsx',
        '**/electron.vite.config.ts',
        'plugins/**',
        '**/types.ts',
        '.eslintrc.cjs'
      ]
    }
  }
}))
