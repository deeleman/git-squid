import { createContext, PropsWithChildren, useCallback, useContext, useRef, useState } from 'react'
import { Transition } from './Transition'

const DEFAULT_ROUTE = 'index'

/**
 * Router entities handled by the `<Router />` underlying context.
 */
type RouterContextApi = {
  /**
   * Redirects the user to the component wrapped by the `<Route>` element annotated with such path.
   * @param path The path whose/s component/s we want to render. Admits full URLs.
   */
  navigate: (path: string) => void
  /**
   * Current route enabled in the system. Defaults to {@link DEFAULT_ROUTE}.
   */
  currentRoute: string
}

const RouterContext = createContext<RouterContextApi | undefined>(undefined)

/**
 * The `<Router>` element, used in combination with its `<Route>` child node, provides
 * a convenient way to emulate string-based routing in the renderer application. If
 * the path passed is a full URL, the router will redirect the user to such URL instead.
 */
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

/**
 * Meant to be used as a child node of {@link Router}, decorated with a `path` property.
 */
export function Route(
  props: PropsWithChildren<{
    /**
     * Path to redirect the user to. Admits full URLs.
     */
    path?: string
  }>
): JSX.Element | null {
  const context = useContext(RouterContext)
  const path = props.path || DEFAULT_ROUTE

  if (!context) {
    throw new Error('The <Route> component must be instantiated inside a <Router> element.')
  }

  return path === context.currentRoute ? <Transition>{props.children}</Transition> : null
}

/**
 * A companion hook to interact with the routing mechanism from any component.
 * @returns A {@link RouterContextApi} object featuring the current route and
 * a `navigate()` handler to toggle the current component.
 */
export function useRouter(): RouterContextApi {
  const context = useContext(RouterContext)

  if (!context) {
    throw new Error(
      'The useNavigate() component must be executed in a component inside a <Router> element.'
    )
  }

  return context
}
