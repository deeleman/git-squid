import { ElectronAPI } from '@electron-toolkit/preload'

export interface GitSquidAPI {
  refreshIssues: (callback: (data: unknown) => void) => void
  tailIssues: () => Promise<unknown>
  markAsRead: (issueId: string) => Promise<unknown>
  enableLoader: (callback: () => void) => void
  getPreferences: () => Promise<Preferences>
  fetchConfiguration: (callback: (data: unknown) => void) => void
  updateConfiguration: (configuration: Configuration) => Promise<unknown>
}

declare global {
  interface Window {
    electron: ElectronAPI
    __gitSquid: GitSquidAPI
  }
}
