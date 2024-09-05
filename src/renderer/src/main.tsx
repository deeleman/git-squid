import './assets/main.css'

import { Theme } from '@twilio-paste/core/theme'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigurationProvider, DataProvider } from './providers'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme.Provider theme="dark">
      <ConfigurationProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </ConfigurationProvider>
    </Theme.Provider>
  </React.StrictMode>
)
