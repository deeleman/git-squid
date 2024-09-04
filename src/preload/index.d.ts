import { ElectronAPI } from '@electron-toolkit/preload'
import type { GitSquidAPI } from './types'

declare global {
  interface Window {
    electron: ElectronAPI // TODO: Remove
    __gitSquid: GitSquidAPI
  }
}
