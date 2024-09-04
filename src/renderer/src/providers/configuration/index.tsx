import { type Configuration } from '@preload/types'
import { createContext, PropsWithChildren, JSX, useState, useEffect, useContext } from 'react'

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
   * Provides a "fire-and-forget" API for updating the configuration.
   * @param configuration The {@link Configuration} object meant to initialize or override the app configuration.
   */
  save: (configuration: Configuration) => Promise<boolean>
}

const ConfigurationContext = createContext<ConfigurationContextApi | undefined>(undefined)

/**
 * The `<ConfigurationProvider>` provides a context wrapper for managing the application
 * repository data and token information across all components and child providers.
 */
export function ConfigurationProvider(props: PropsWithChildren): JSX.Element {
  const [configuration, setConfiguration] = useState<Configuration>()
  const gitSquidAPI = window.__gitSquid

  const save = (configuration: Configuration): Promise<boolean> =>
    gitSquidAPI.updateConfiguration(configuration)

  useEffect(() => {
    gitSquidAPI.onConfiguration(setConfiguration)
  }, [setConfiguration])

  const configurationContextProps = { configuration, save }

  return (
    <ConfigurationContext.Provider value={configurationContextProps}>
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
