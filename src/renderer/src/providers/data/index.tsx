import type { Issue, Issues, IssuesMap } from '@preload/types'
import {
  createContext,
  JSX,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useConfiguration } from '../configuration'

/**
 * The public API of the {@link DataProvider} context element.
 */
type DataContextApi = {
  issues?: Issues
  repositoryURLs: string[]
  loading?: boolean
  isComplete?: boolean
  error?: string
  load: (fetchNew?: boolean) => void
  read: (issue: string | Issue) => void
}

const DataContext = createContext<DataContextApi | undefined>(undefined)

const gitSquidAPI = window.__gitSquid

/**
 * The `<DataProvider>` provides a context wrapper for managing the data fetched from
 * the GitHub services and handle its state across all components and child providers.
 */
export function DataProvider(props: PropsWithChildren): JSX.Element {
  const [issuesMap, setIssuesMap] = useState<IssuesMap>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const { configuration } = useConfiguration()

  const hasRegisteredListener = useRef(false)

  const [issues, isComplete] = useMemo(() => {
    const url = configuration?.url
    return url && issuesMap && url in issuesMap
      ? [issuesMap[url]?.issues || [], issuesMap[url]?.isComplete]
      : [undefined, false]
  }, [issuesMap, configuration?.url])

  const repositoryURLs = useMemo(() => {
    return Object.keys(issuesMap)
  }, [issuesMap, configuration?.url])

  const load = useCallback(
    (fetchNew?: boolean): void => {
      if (isComplete && !fetchNew) return

      setError(undefined)

      if (!loading) {
        setLoading(true)

        gitSquidAPI
          .fetchIssues(fetchNew)
          .then(({ success, error }) => {
            if (!success) {
              throw new Error(`An unknown error occurred upon fetching data: ${error}`)
            }
          })
          .catch(setError)
      }
    },
    [loading, setLoading, setError]
  )

  const read = useCallback(
    (issue: string | Issue): void => {
      const id = typeof issue === 'string' ? issue : issue.id.toString()
      gitSquidAPI.readIssue(id)

      const url = configuration?.url

      if (issuesMap && url && url in issuesMap) {
        const issue = issuesMap[url]?.issues?.find((issue) => issue.id === +id)
        if (issue) {
          issue.read = true
        }
      }
    },
    [issuesMap, configuration?.url]
  )

  const onIssuesCallback = useCallback(
    (updatedIssuesMap: IssuesMap): void => {
      setIssuesMap(updatedIssuesMap)
      setLoading(false)
    },
    [setIssuesMap, setLoading]
  )

  useEffect(() => {
    if (!hasRegisteredListener.current) {
      gitSquidAPI.onIssues((updatedIssues) => onIssuesCallback(updatedIssues))
      hasRegisteredListener.current = true
    }
  }, [onIssuesCallback])

  return (
    <DataContext.Provider
      value={{ issues, loading, load, error, read, isComplete, repositoryURLs }}
    >
      {props.children}
    </DataContext.Provider>
  )
}

/**
 * A companion hook to interact with the issues data manager from any component.
 * @returns A {@link DataContextApi} object featuring the current state
 * of loading processes and the last snapshot of issues data. Additionally it provides
 * methods for requesting data fetch operations and mark issues as viewed.
 */
export function useData(): DataContextApi {
  const context = useContext(DataContext)

  if (!context) {
    throw new Error(
      'The useData() component must be executed in a component inside a <DataProvider> element.'
    )
  }

  return context
}
