import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer, type IpcRenderer } from 'electron'
import { type Configuration, type GitSquidAPI, type Issues, MessageType } from './types'

// Custom APIs for renderer
const gitSquidAPI: GitSquidAPI = {
  onIssuesRefresh: (callback: (data: Issues) => void): IpcRenderer =>
    ipcRenderer.on(MessageType.RefreshIssues, (_, data: Issues) => callback(data)),
  refreshIssues: (): Promise<unknown> => ipcRenderer.invoke(MessageType.TailIssues),
  markAsRead: (issueId: string): Promise<unknown> =>
    ipcRenderer.invoke(MessageType.UpdateConfiguration, issueId),
  onDisplayLoader: (callback: () => void): IpcRenderer =>
    ipcRenderer.on(MessageType.DisplayLoader, () => callback()),
  onConfigurationUpdate: (callback: (configuration: Configuration) => void): IpcRenderer =>
    ipcRenderer.on(MessageType.UpdateConfiguration, (_, data: Configuration) => callback(data)),
  updateConfiguration: (configuration: Configuration): Promise<unknown> =>
    ipcRenderer.invoke(MessageType.UpdateConfiguration, configuration),
  onError: (callback: (error: unknown) => void): IpcRenderer =>
    ipcRenderer.on(MessageType.Error, (_, error: unknown) => callback(error))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI) // TODO: Remove
    contextBridge.exposeInMainWorld('__gitSquid', gitSquidAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.__gitSquid = gitSquidAPI
}
