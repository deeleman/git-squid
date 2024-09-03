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
   * Fetches the current configuration setup data, if already persisted.
   */
  FetchConfiguration = 'config:fetch',
  /**
   * Updates config by submitting a {@link Configuration} payload.
   */
  UpdateConfiguration = 'config:update',
  /**
   * Emits a request for fetching the latest issues.
   */
  RefreshIssues = 'data:refresh',
  /**
   * Emits a request for fetching older issues, based on the latest page fetched from main.
   */
  TailIssues = 'data:tail',
  /**
   * Listens for requests from main to reset the screen and display the Loading screen.
   */
  ListenForLoadingProcess = 'loader:display',
  /**
   * Marks a given issue as read
   */
  MarkAsRead = 'data:issueChecked'
}

/**
 * The {@link Issue} type represents a serialized, redux version of a GitHub issue as required by GitSquid.
 */
export type Issue = {
  id: string
}

/**
 * The {@link Issues} type represents an array of {@link Issue} instance objects.
 */
export type Issues = Issue[]