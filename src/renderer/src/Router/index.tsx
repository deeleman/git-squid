import { createContext, PropsWithChildren, useCallback, useContext, useRef, useState } from 'react'

type RouterContextApi = {
  navigate: (path: string) => void
  currentRoute: string
}

const DEFAULT_ROUTE = 'index'
const RouterContext = createContext<RouterContextApi | undefined>(undefined)

export function Router(props: PropsWithChildren): JSX.Element {
  const [currentRoute, setCurrentRoute] = useState(DEFAULT_ROUTE)
  const externalRouteRegexRef = useRef(new RegExp(/^https?:/))

  const navigate = useCallback(
    (path: string) => {
      if (externalRouteRegexRef.current.test(path)) {
        window.location.assign(path)
      } else if (path !== currentRoute) {
        setCurrentRoute(path)
      }
    },
    [currentRoute]
  )

  const routerContextProps = { currentRoute, navigate }

  return (
    <RouterContext.Provider value={routerContextProps}>{props.children}</RouterContext.Provider>
  )
}

export function Route(props: PropsWithChildren<{ path?: string }>): JSX.Element | null {
  const context = useContext(RouterContext)
  const path = props.path || DEFAULT_ROUTE

  if (!context) {
    throw new Error('The <Route> component must be instantiated inside a <Router> element.')
  }

  return path === context.currentRoute ? <>{props.children}</> : null
}

export function useRouter(): RouterContextApi {
  const context = useContext(RouterContext)

  if (!context) {
    throw new Error(
      'The useNavigate() component must be executed in a component inside a <Router> element.'
    )
  }

  return context
}
