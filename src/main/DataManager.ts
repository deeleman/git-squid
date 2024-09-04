import { app, type BrowserWindow, ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'
import { type Configuration, Issue, type Issues, MessageType } from '../preload/types'
import type ConfigurationManager from './ConfigurationManager'

type ReadIssuesMap = {
  [url: string]: Record<string, boolean>
}

export default class DataManager {
  issues?: Issues

  private readIssues: ReadIssuesMap

  private currentPage = 1

  private lastRead = new Date()

  private issuesStoreFilePath = path.join(app.getPath('userData'), 'read.conf')

  private repositoryUrlRef: string

  constructor(
    private readonly browserWindow: BrowserWindow,
    private readonly configManager: ConfigurationManager
  ) {
    try {
      const readIssuesBackup = fs.readFileSync(this.issuesStoreFilePath, { encoding: 'utf-8' })
      this.readIssues = JSON.parse(readIssuesBackup) as ReadIssuesMap
    } catch (e) {
      this.readIssues = {
        [this.configManager.configuration.url]: {}
      }
    }

    ipcMain.handle(MessageType.ReadIssue, (_, issueId: string) => this.markIssueAsRead(issueId))

    ipcMain.handle(MessageType.FetchIssues, (_, refresh?: boolean) =>
      this.fetchIssues(this.configManager.configuration, refresh)
    )

    this.repositoryUrlRef = this.configManager.configuration.url

    this.fetchIssues(this.configManager.configuration, true)
  }

  async fetchIssues(configuration: Configuration, refresh?: boolean): Promise<boolean> {
    const { repository, token, username } = configuration

    let url = `https://api.github.com/repos/${username}/${repository}/issues?per_page=50`

    if (refresh) {
      url = `${url}&since=${this.lastRead.toISOString()}&page=1`
    } else {
      url = `${url}&page=${this.currentPage}`
    }

    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      if (response.ok) {
        const newIssues = this.parseResponseIssues(await response.json())
        this.issues = this.mergeAndSortIssues(newIssues)
        this.lastRead = new Date()

        // If the URL passed does not match the original URL ref stored
        // we assume this is a new repository so current page is reset.
        if (this.repositoryUrlRef !== url) {
          this.repositoryUrlRef = url
          this.currentPage = 1
        } else {
          this.currentPage = this.currentPage + 1
        }

        this.broadcast()
        return true
      } else {
        throw new Error(`GitHub API returned a ${response.status} error`)
      }
    } catch {
      return false
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
      dateClosed: this.formatDate(item.closed_at),
      title: item.title,
      state: item.state,
      isLocked: item.locked,
      body: item.body,
      labels: item.labels.map((label) => (typeof label === 'string' ? label : label.name)),
      read: item.id in this.readIssues[this.configManager.configuration.url]
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

  broadcast(): void {
    if (Array.isArray(this.issues)) {
      this.browserWindow.webContents.send(MessageType.Issues, this.issues)
      console.log(this.issues)
    }
  }

  markIssueAsRead(issueId: string): void {
    this.readIssues[this.configManager.configuration.url][issueId] = true

    fs.writeFile(this.issuesStoreFilePath, JSON.stringify(this.readIssues), (error) => {
      if (error) console.error(error)
    })
  }

  private formatDate(dateString: string): string {
    const dateObject = new Date(dateString)

    return dateObject.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}
