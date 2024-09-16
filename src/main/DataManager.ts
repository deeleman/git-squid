import { type BrowserWindow, ipcMain } from 'electron'
import { MessageType } from '../preload/types'
import type { Configuration, Issue, Issues, IssuesMap } from '../preload/types'
import ConfigurationManager from './ConfigurationManager'
import FileManager from './FileManager'

type ReadIssuesMap = {
  [url: string]: Record<string, boolean | Date> & { lastUpdated: Date }
}

const PAGE_ITEMS = 50

export default class DataManager {
  issuesMap: IssuesMap = {}

  private configManager: ConfigurationManager

  private fileManager: FileManager

  private readIssues: ReadIssuesMap

  private browserWindow?: BrowserWindow

  constructor() {
    this.configManager = new ConfigurationManager()

    // Validates config update requests based on whether the new config is honored by GitHub
    this.configManager.onConfigurationUpdateRequest((configuration) => {
      return this.fetchIssues(configuration, true)
    })

    this.fileManager = new FileManager('read.conf', true)

    try {
      this.readIssues = this.fileManager.read<ReadIssuesMap>()
      Object.keys(this.readIssues).forEach((key) => {
        if (key !== 'lastUpdated') {
          this.issuesMap[key] = {}
        }
      })
    } catch (e) {
      this.issuesMap[this.configManager.configuration.url] = {}
      this.readIssues = {
        [this.configManager.configuration.url]: {
          lastUpdated: new Date()
        }
      }

      this.fileManager.write(this.readIssues)
    }

    ipcMain.handle(MessageType.ReadIssue, (_, issueId: string) => this.markIssueAsRead(issueId))

    ipcMain.handle(MessageType.FetchIssues, (_, refresh?: boolean) =>
      this.fetchIssues(this.configManager.configuration, refresh)
    )
  }

  registerWindow(browserWindow: BrowserWindow): void {
    this.browserWindow = browserWindow
    this.configManager.registerWindow(browserWindow)
  }

  async fetchIssues(
    configuration: Configuration,
    refresh?: boolean
  ): Promise<{ success: boolean; error?: unknown }> {
    const { repository, token, username, url } = configuration

    const repositoryIssues = this.issuesMap[url]

    try {
      let serviceUrl = `https://api.github.com/repos/${username}/${repository}/issues?state=all&per_page=${PAGE_ITEMS}`

      if (refresh && repositoryIssues && repositoryIssues.lastRead) {
        serviceUrl = `${serviceUrl}&since=${repositoryIssues.lastRead.toISOString()}&page=1`
      } else {
        const currentPage = Array.isArray(repositoryIssues?.issues)
          ? Math.floor(repositoryIssues.issues.length / PAGE_ITEMS) + 1
          : 1
        serviceUrl = `${serviceUrl}&page=${currentPage}`
      }

      const response = await fetch(serviceUrl, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      if (response.ok) {
        const responseJson = await response.json()

        // Prior to parse raw issues we ensure there is an entry in the read issues dictionary for this url
        if (url && !this.readIssues[url]) {
          this.readIssues[url] = {
            lastUpdated: new Date()
          }
        }

        const newIssues = this.parseResponseIssues(responseJson, url)
        const issues = this.mergeAndSortIssuesByURL(newIssues, url, refresh)
        const lastRead = new Date()
        const isComplete = issues.length % PAGE_ITEMS > 0

        if (Array.isArray(issues) && this.browserWindow) {
          this.issuesMap[url] = {
            issues,
            lastRead,
            isComplete
          }
          this.browserWindow.webContents.send(MessageType.Issues, this.issuesMap)
        }

        this.readIssues[url].lastUpdated = new Date()

        return { success: true }
      } else {
        throw new Error(`The request to ${serviceUrl} returned a ${response.status} error`)
      }
    } catch (e) {
      console.error(e)
      return { success: false, error: e }
    }
  }

  markIssueAsRead(issueId: string): void {
    const { url } = this.configManager.configuration
    this.readIssues[url][issueId] = true
    this.fileManager.write(this.readIssues)

    const issue = this.issuesMap[url]?.issues?.find((issue) => issue.id === +issueId)
    if (issue) {
      issue.read = true // FIXME: Avoid mutating the object
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseResponseIssues(rawIssues: any[], url: string): Issues {
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
      read: item.id in this.readIssues[url],
      isPullRequest: !!item.pull_request, // GitHub's REST API considers every pull request an issue, so we flag those
      isNew:
        new Date(item.created_at).getTime() > new Date(this.readIssues[url].lastUpdated).getTime()
    }))
  }

  private mergeAndSortIssuesByURL(newIssues: Issues, url: string, refresh?: boolean): Issues {
    let existingIssues = this.issuesMap[url]?.issues || []
    if (refresh) {
      existingIssues = existingIssues.map((issue) => ({
        ...issue,
        isNew: false
      }))
    }
    const mergedIssues = [...existingIssues, ...newIssues]

    const mergedIssuesSet = mergedIssues.reduce(
      (map, issue) => ({
        ...map,
        [issue.id]: issue
      }),
      {}
    )

    return Object.values<Issue>(mergedIssuesSet).sort((a, b) => b.id - a.id)
  }

  private formatDate(dateString: string): string {
    const dateObject = new Date(dateString)

    return dateObject.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}
