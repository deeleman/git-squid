import './assets/main.css'

import { Theme } from '@twilio-paste/core/theme'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigurationProvider } from './providers/configuration'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme.Provider theme="dark">
      <ConfigurationProvider>
        <App />
      </ConfigurationProvider>
    </Theme.Provider>
  </React.StrictMode>
)
