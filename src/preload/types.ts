/**
 * Global I/O payload for configuration setup
 */
export type Configuration = {
  /**
   * The URL for the repository
   */
  url: string
  /**
   * The repository user, extracted out from the URL
   */
  username: string
  /**
   * The repository name, extracted out from the URL
   */
  repository: string
  /**
   * The Github Personal Access Token (PAT).
   */
  token: string
}

/**
 * Message types for event-driven data exchange between main and renderer.
 */
export enum MessageType {
  /**
   * Broadcast a new configuration object if successfully updated.
   */
  Configuration = 'config:push',
  /**
   * Updates config by submitting a {@link Configuration} payload.
   */
  UpdateConfiguration = 'config:update',

  /**
   * Broadcasts the current issues recordset, usually updated after invoking 'data:fetch'.
   */
  Issues = 'data:push',
  /**
   * Emits a request for fetching the latest issues.
   */
  FetchIssues = 'data:fetch',
  /**
   * Marks a given issue as read
   */
  ReadIssue = 'data:issueIsRead'
}

/**
 * The {@link Issue} type represents a serialized, redux version of a GitHub issue as required by GitSquid.
 */
export type Issue = {
  id: number
  url: string
  comments: number
  author: string
  authorURL: string
  isAdmin: boolean
  assignee?: string
  assigneeURL?: string
  dateOpened: string
  dateClosed?: string
  title: string
  state: 'open' | 'closed'
  isLocked: boolean
  body: string
  labels?: string[]
  read: boolean
  isPullRequest: boolean
  isNew?: boolean
}

/**
 * The {@link Issues} type represents an array of {@link Issue} instance objects.
 */
export type Issues = Issue[]

/**
 * The global issues graph exchanged between main and renderer
 */
export type IssuesMap = {
  /**
   * URL of a given public GitHub repository.
   */
  [url: string]:
    | {
        /**
         * Issues collection.
         */
        issues?: Issues
        /**
         * Date of last fetch request.
         */
        lastRead?: Date
        /**
         * Signals whether the successive fetch requests have reached the end of the recordset.
         */
        isComplete?: boolean
      }
    | undefined
}

/**
 * The shared interface exposed to Renderer.
 */
export interface GitSquidAPI {
  updateConfiguration: (configuration: Configuration) => Promise<boolean>
  onConfiguration: (callback: (configuration: Configuration) => void) => void

  fetchIssues: (refresh?: boolean) => Promise<{ success: boolean; error?: unknown }>
  onIssues: (callback: (issuesMap: IssuesMap) => void) => void
  readIssue: (issueId: string) => Promise<void>
}
