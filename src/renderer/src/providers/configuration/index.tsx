import { type Configuration } from '@preload/types'
import { isValidURL, parseURL } from '@renderer/helpers'
import {
  createContext,
  PropsWithChildren,
  JSX,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback
} from 'react'

/**
 * The public API of the {@link ConfigurationProvider} context element.
 */
type ConfigurationContextApi = {
  /**
   * Exposes the current {@link Configuration} data as saved and persisted
   * previously by the user or `undefined` if none.
   */
  configuration?: Configuration
  /**
   * Informs whether the configuration information is already available or not.
   */
  isReady?: boolean
  /**
   * Provides a "fire-and-forget" API for updating the configuration.
   * @param configuration The {@link Configuration} object meant to initialize or override the app configuration.
   */
  save: (configuration: Configuration) => Promise<boolean>
  /**
   * Replaces the configuration URL property value with another
   * @param url
   * @returns
   */
  swapURL: (url: string) => void
}

const ConfigurationContext = createContext<ConfigurationContextApi | undefined>(undefined)

const gitSquidAPI = window.__gitSquid

/**
 * The `<ConfigurationProvider>` provides a context wrapper for managing the application
 * repository data and token information across all components and child providers.
 */
export function ConfigurationProvider(props: PropsWithChildren): JSX.Element {
  const [configuration, setConfiguration] = useState<Configuration>()

  const isReady = useMemo(() => {
    return !!configuration?.token && !!configuration?.url
  }, [configuration?.token, configuration?.url])

  const save = useCallback((configuration: Configuration): Promise<boolean> => {
    return gitSquidAPI.updateConfiguration(configuration)
  }, [])

  const swapURL = useCallback(
    (url: string): void => {
      const urlIsValid = isValidURL(url)
      if (urlIsValid && configuration && configuration?.url !== url) {
        const [username, repository] = parseURL(url)
        save({
          token: configuration.token,
          username,
          repository,
          url
        })
      } else {
        throw new Error(
          `The URL provided '${url}' does not seem a valid public GitHub repository URL`
        )
      }
    },
    [configuration, setConfiguration]
  )

  useEffect(() => {
    gitSquidAPI.onConfiguration((configuration) => {
      setConfiguration(configuration)
    })
  }, [setConfiguration])

  return (
    <ConfigurationContext.Provider value={{ configuration, isReady, save, swapURL }}>
      {props.children}
    </ConfigurationContext.Provider>
  )
}

/**
 * A companion hook to interact with the configuration manager from any component.
 * @returns A {@link ConfigurationContextApi} object featuring the current configuration
 * details and a `save()` handler to update the current configuration.
 */
export function useConfiguration(): ConfigurationContextApi {
  const context = useContext(ConfigurationContext)

  if (!context) {
    throw new Error(
      'The useConfiguration() component must be executed in a component inside a <ConfigurationProvider> element.'
    )
  }

  return context
}
