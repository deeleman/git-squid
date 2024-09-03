import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer, type IpcRenderer } from 'electron'
import { type Configuration, type Issues, MessageType } from './types'

// Custom APIs for renderer
const gitSquidAPI = {
  refreshIssues: (callback: (data: Issues) => void): IpcRenderer =>
    ipcRenderer.on(MessageType.RefreshIssues, (_, data: Issues) => callback(data)),
  tailIssues: (): Promise<unknown> => ipcRenderer.invoke(MessageType.TailIssues),
  markAsRead: (issueId: string): Promise<unknown> =>
    ipcRenderer.invoke(MessageType.UpdateConfiguration, issueId),
  enableLoader: (callback: () => void): IpcRenderer =>
    ipcRenderer.on(MessageType.ListenForLoadingProcess, () => callback()),
  fetchConfiguration: (callback: (configuration: Configuration) => void): IpcRenderer =>
    ipcRenderer.on(MessageType.UpdateConfiguration, (_, data: Configuration) => callback(data)),
  updateConfiguration: (configuration: Configuration): Promise<unknown> =>
    ipcRenderer.invoke(MessageType.UpdateConfiguration, configuration)
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
