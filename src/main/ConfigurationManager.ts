import { type BrowserWindow, ipcMain } from 'electron'
import { type Configuration, MessageType } from '../preload/types'
import FileManager from './FileManager'

export default class ConfigurationManager {
  configuration: Configuration

  private fileManager: FileManager

  private browserWindow?: BrowserWindow

  private testingCallback?: (configuration: Configuration) => Promise<boolean> | boolean

  constructor() {
    this.fileManager = new FileManager('gitsquid.conf')

    try {
      this.configuration = this.fileManager.read<Configuration>()
    } catch (e) {
      this.configuration = {
        repository: '',
        token: '',
        url: '',
        username: ''
      }
    }

    ipcMain.handle(MessageType.UpdateConfiguration, (_, configuration: Configuration) =>
      this.save(configuration)
    )
  }

  registerWindow(browserWindow: BrowserWindow): void {
    this.browserWindow = browserWindow
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
      if (this.browserWindow) {
        this.browserWindow.webContents.send(MessageType.Configuration, this.configuration)
      }
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

    this.fileManager.write(configuration)
  }
}
