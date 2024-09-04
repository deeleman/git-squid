import crypto from 'crypto'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import type { PluginOption } from 'vite'

/**
 * The `generateGitSquidKeysPlugin` plug-in populates environment variables
 * containing the crypto keys required to support encrypting logic for
 * persisting sensitive data in the filesystem.
 */
export function generateGitSquidKeysPlugin(command: 'build' | 'serve'): PluginOption {
  return {
    name: 'generate-git-squid-keys-plugin',
    apply: command,
    buildEnd: async (): Promise<void> => {
      // Fixed unsafe dummy keys for development
      let key = '395f46b7b0d78b2793e976c5326a379a'
      let iv = '0521b168b35255bf'

      if (command === 'build') {
        // Secret hashed keys for production environments generated once on build time
        key = crypto.randomBytes(32).toString('hex').substring(32)
        iv = crypto.randomBytes(16).toString('hex').substring(16)
      }

      const secrets = `SQUID_MAIN_KEY=${key}\nSQUID_MAIN_IV=${iv}`
      writeFileSync(resolve(__dirname, '.env'), secrets)
    }
  }
}
