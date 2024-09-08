/**
 * Parses a valid URL to a GitHub repo and returns the repo owner and name.
 * @param url A valid URL to a public Github repository. Can contain subfolders.
 * @returns A tuple of string values featuring the GH owner username and the repo name.
 */
export const parseURL = (url: string): [string, string] => {
  const urlObject = new URL(url)
  const [, username, repository] = urlObject.pathname.split('/')

  return [username, repository]
}

const tokenRegex = new RegExp(/^(gh[pous]_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{22,38})$/)

/**
 * Validates if a given token payload is valid according to GitHub's PAT format.
 * @param token The token to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidToken = (token: string): boolean => tokenRegex.test(token)

const urlRegex = new RegExp(/^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/)

/**
 * Validates if a given URL payload is valid according to GitHub's public repository URL schema.
 * @param token The URL to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidURL = (url: string): boolean => urlRegex.test(url)
