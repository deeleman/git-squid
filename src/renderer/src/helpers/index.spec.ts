import { isValidToken, isValidURL, parseURL } from './index'

describe('parseURL', () => {
  test('should return a tuple with the owner and the repository name', () => {
    const [username, repository] = parseURL('https://github.com/deeleman/git-squid')

    expect(username).toEqual('deeleman')
    expect(repository).toEqual('git-squid')
  })

  test('should throw an error if the passed URL is not a valid GitHub repository', () => {
    expect(() => parseURL('https://www.github.com/faq')).toThrow()
  })
})

describe('isValidURL', () => {
  test('should return true when the passed URL is a valid GitHub repository', () => {
    expect(isValidURL('https://github.com/deeleman/git-squid')).toBeTruthy()
  })

  test('should return false when the passed URL is NOT a valid GitHub repository', () => {
    expect(isValidURL('https://www.github.com/faq')).toBeFalsy()
  })
})

describe('isValidToken', () => {
  test('should return true when the passed string is a valid GitHub Personal Access Token (PAT)', () => {
    expect(isValidToken('ghp_abC123xYz89DefgHijkLm45NOPqrsTuvWxYZ')).toBeTruthy()
  })

  test('should return false when the passed string is NOT a valid GitHub Personal Access Token (PAT)', () => {
    expect(isValidToken('bC123xYz89DefgHijkLm45NOPqrsTuvWxYZ')).toBeFalsy()
  })
})
