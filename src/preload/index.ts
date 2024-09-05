import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer, type IpcRenderer } from 'electron'
import { type Configuration, type GitSquidAPI, type Issues, MessageType } from './types'

// Custom APIs for renderer
const gitSquidAPI: GitSquidAPI = {
  onConfiguration: (callback: (configuration: Configuration) => void): IpcRenderer =>
    ipcRenderer.on(MessageType.Configuration, (_, data: Configuration) => callback(data)),
  updateConfiguration: (configuration: Configuration): Promise<boolean> =>
    ipcRenderer.invoke(MessageType.UpdateConfiguration, configuration),

  fetchIssues: (refresh?: boolean): Promise<boolean> =>
    ipcRenderer.invoke(MessageType.FetchIssues, refresh),
  onIssues: (callback: (data: Issues) => void): IpcRenderer =>
    ipcRenderer.on(MessageType.Issues, (_, data: Issues) => callback(data)),
  readIssue: (issueId: string): Promise<void> => ipcRenderer.invoke(MessageType.ReadIssue, issueId)
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
  window.electron = electronAPI // TODO: Remove
  // @ts-ignore (define in dts)
  window.__gitSquid = gitSquidAPI
}
