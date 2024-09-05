import type { Issue, Issues } from '@preload/types'
import {
  createContext,
  PropsWithChildren,
  JSX,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react'

/**
 * The public API of the {@link DataProvider} context element.
 */
type DataContextApi = {
  issues?: Issues
  loading?: boolean
  error?: string
  isComplete: boolean
  load: (fetchNew?: boolean) => void
  read: (issue: string | Issue) => void
}

const DataContext = createContext<DataContextApi | undefined>(undefined)

/**
 * The `<DataProvider>` provides a context wrapper for managing the data fetched from
 * the GitHub services and handle its state across all components and child providers.
 */
export function DataProvider(props: PropsWithChildren): JSX.Element {
  const [issues, setIssues] = useState<Issues>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [isComplete, setComplete] = useState(false)
  const gitSquidAPI = window.__gitSquid

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

  const read = (issue: string | Issue): void => {
    const id = typeof issue === 'string' ? issue : issue.id.toString()
    gitSquidAPI.readIssue(id)
    setIssues((issues) => {
      return issues?.map((issue) => ({
        ...issue,
        read: issue.read || issue.id === +id
      }))
    })
  }

  useEffect(() => {
    gitSquidAPI.onIssues((updatedIssues) => {
      if (issues && updatedIssues.length === issues.length) {
        setComplete(true)
      }

      setIssues(updatedIssues)
      setLoading(false)
    })
  }, [setIssues, setLoading, issues])

  return (
    <DataContext.Provider value={{ issues, loading, load, error, read, isComplete }}>
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
