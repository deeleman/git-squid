import { type BrowserWindow, type IpcMain } from 'electron'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { type Configuration, MessageType } from '../preload/types'

export default class ConfigurationManager {
  configuration: Configuration

  private backupFilePath = path.join(app.getPath('userData'), 'gitsquid.conf')

  private testingCallback?: (configuration: Configuration) => Promise<boolean> | boolean

  constructor(
    private readonly ipcMain: IpcMain,
    private readonly browserWindow: BrowserWindow
  ) {
    try {
      const configurationBackup = fs.readFileSync(this.backupFilePath, { encoding: 'utf-8' })
      this.configuration = JSON.parse(configurationBackup) as Configuration
    } catch (e) {
      this.configuration = {
        repository: '',
        token: '',
        url: '',
        username: ''
      }
    }

    this.ipcMain.handle(MessageType.UpdateConfiguration, (_, configuration: Configuration) =>
      this.save(configuration)
    )
  }

  broadcast(): void {
    this.browserWindow.webContents.send(MessageType.Configuration, this.configuration)
  }

  onConfigurationUpdateRequest(
    testingCallback: (configuration: Configuration) => Promise<boolean> | boolean
  ): void {
    this.testingCallback = testingCallback
  }

  async save(configuration: Configuration): Promise<boolean> {
    const isValid = await this.testConfiguration(configuration)

    if (isValid) {
      this.persist(configuration)
      this.browserWindow.webContents.send(MessageType.Configuration, this.configuration)
    }

    return isValid
  }

  private async testConfiguration(configuration: Configuration): Promise<boolean> {
    if (!this.testingCallback) {
      return true
    } else {
      return this.testingCallback(configuration)
    }
  }

  private persist(configuration: Configuration): void {
    this.configuration = configuration

    fs.writeFile(this.backupFilePath, JSON.stringify(configuration), (error) => {
      if (error) console.error(error)
    })
  }
}
