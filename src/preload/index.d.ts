import { ElectronAPI } from '@electron-toolkit/preload'
import type { GitSquidAPI } from './types'

declare global {
  interface Window {
    electron: ElectronAPI
    __gitSquid: GitSquidAPI
  }
}
