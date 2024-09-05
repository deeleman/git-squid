import { type BrowserWindow, ipcMain } from 'electron'
import { type Configuration, Issue, type Issues, MessageType } from '../preload/types'
import type ConfigurationManager from './ConfigurationManager'
import FileManager from './FileManager'

type ReadIssuesMap = {
  [url: string]: Record<string, boolean>
}

export default class DataManager {
  issues?: Issues

  private fileManager: FileManager

  private readIssues: ReadIssuesMap

  private currentPage = 1

  private lastRead = new Date()

  private repositoryUrlRef: string

  private browserWindow?: BrowserWindow

  constructor(private readonly configManager: ConfigurationManager) {
    this.repositoryUrlRef = this.configManager.configuration.url

    this.fileManager = new FileManager('read.conf', true)

    try {
      this.readIssues = this.fileManager.read<ReadIssuesMap>()
    } catch (e) {
      this.readIssues = {
        [this.configManager.configuration.url]: {}
      }
    }

    ipcMain.handle(MessageType.ReadIssue, (_, issueId: string) => this.markIssueAsRead(issueId))

    ipcMain.handle(MessageType.FetchIssues, (_, refresh?: boolean) =>
      this.fetchIssues(this.configManager.configuration, refresh)
    )
  }

  registerWindow(browserWindow: BrowserWindow): void {
    this.browserWindow = browserWindow
  }

  async fetchIssues(
    configuration: Configuration,
    refresh?: boolean
  ): Promise<{ success: boolean; error?: unknown }> {
    const { repository, token, username } = configuration
    const PAGE_ITEMS = 50

    try {
      let url = `https://api.github.com/repos/${username}/${repository}/issues?per_page=${PAGE_ITEMS}`

      if (refresh && this.issues && this.issues.length > 0) {
        url = `${url}&since=${this.lastRead.toISOString()}&page=1`
      } else {
        url = `${url}&page=${this.currentPage}`
      }

      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      if (response.ok) {
        const responseJson = await response.json()

        // Before parsing data, we check if the URL passed does not match the original URL ref stored
        // we assume this is a new repository so current page and url are reset same as current issues
        if (this.repositoryUrlRef !== configuration.url) {
          this.repositoryUrlRef = configuration.url
          this.currentPage = 1
          this.issues = undefined
        }

        // Prior to parse raw issues we ensure there is an entry in the read issues dictionary for this url
        if (!this.readIssues[this.repositoryUrlRef]) {
          this.readIssues[this.repositoryUrlRef] = {}
        }

        const newIssues = this.parseResponseIssues(responseJson)
        this.issues = this.mergeAndSortIssues(newIssues)
        this.lastRead = new Date()

        // Page index is bumped only when newly fetched items match the page size, which
        // allows assuming there might still be more paginated records to fetch
        if (newIssues.length === PAGE_ITEMS) {
          this.currentPage = this.currentPage + 1
        }

        if (Array.isArray(this.issues) && this.browserWindow) {
          this.browserWindow.webContents.send(MessageType.Issues, this.issues)
        }

        return { success: true }
      } else {
        throw new Error(`The request to ${url} returned a ${response.status} error`)
      }
    } catch (e) {
      console.error(e)
      return { success: false, error: e }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseResponseIssues(rawIssues: any[]): Issues {
    return rawIssues.map<Issue>((item) => ({
      id: item.id,
      url: item.url,
      comments: item.comments || 0,
      author: item.user.login,
      authorURL: item.user.html_url,
      isAdmin: item.user.site_admin,
      assignee: item.assignee?.login,
      assigneeURL: item.assignee?.html_url,
      dateOpened: this.formatDate(item.created_at),
      dateClosed: item.closed_at ? this.formatDate(item.closed_at) : undefined,
      title: item.title,
      state: item.state,
      isLocked: item.locked,
      body: item.body,
      labels: item.labels.map((label) => (typeof label === 'string' ? label : label.name)),
      read: item.id in this.readIssues[this.repositoryUrlRef]
    }))
  }

  mergeAndSortIssues(newIssues: Issues): Issues {
    const mergedIssues = [...(this.issues || []), ...newIssues]

    const mergedIssuesSet = mergedIssues.reduce(
      (map, issue) => ({
        ...map,
        [issue.id]: issue
      }),
      {}
    )

    return Object.values<Issue>(mergedIssuesSet).sort((a, b) => b.id - a.id)
  }

  markIssueAsRead(issueId: string): void {
    this.readIssues[this.configManager.configuration.url][issueId] = true
    this.fileManager.write(this.readIssues)

    const issue = this.issues?.find((issue) => issue.id === +issueId)
    if (issue) {
      issue.read = true // FIXME: Avoid mutating the object
    }
  }

  private formatDate(dateString: string): string {
    const dateObject = new Date(dateString)

    return dateObject.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}
