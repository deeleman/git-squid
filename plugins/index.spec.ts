import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateGitSquidKeysPlugin } from './index'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve(__dirname, '..', '.env')

interface PluginWithConfig {
  config: () => Promise<void>
}

function hasConfig(obj: unknown): obj is PluginWithConfig {
  return (
    !!obj &&
    typeof obj === 'object' &&
    'config' in obj &&
    typeof (obj as PluginWithConfig).config === 'function'
  )
}

describe('generateGitSquidKeysPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (fs.existsSync(envPath)) fs.unlinkSync(envPath)
  })

  it('should always return a plugin object with config property', () => {
    const pluginServe = generateGitSquidKeysPlugin('serve')
    const pluginBuild = generateGitSquidKeysPlugin('build')
    expect(pluginServe).toBeDefined()
    expect(pluginBuild).toBeDefined()
    expect(typeof pluginServe).toBe('object')
    expect(typeof pluginBuild).toBe('object')
    expect(pluginServe && 'config' in pluginServe).toBe(true)
    expect(pluginBuild && 'config' in pluginBuild).toBe(true)
  })

  it('should write fixed dummy keys in development (serve)', async () => {
    const plugin = generateGitSquidKeysPlugin('serve')

    if (hasConfig(plugin)) {
      await plugin.config()
      const envContent = fs.readFileSync(envPath, 'utf8')
      expect(envContent).toContain('SQUID_MAIN_KEY=395f46b7b0d78b2793e976c5326a379a')
      expect(envContent).toContain('SQUID_MAIN_IV=0521b168b35255bf')
    }
  })

  it('should write random keys in production (build)', async () => {
    const plugin = generateGitSquidKeysPlugin('build')

    if (hasConfig(plugin)) {
      await plugin.config()
      const envContent = fs.readFileSync(envPath, 'utf8')
      // Should not match the dummy values
      expect(envContent).not.toContain('395f46b7b0d78b2793e976c5326a379a')
      expect(envContent).not.toContain('0521b168b35255bf')
      // Should match expected env format
      expect(envContent).toMatch(/SQUID_MAIN_KEY=\w{16,32}/)
      expect(envContent).toMatch(/SQUID_MAIN_IV=\w{8,16}/)
    }
  })
})
