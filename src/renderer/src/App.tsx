import { Route, Router } from './providers/router'
import Loader from './components/Loader'
import Settings from './components/Settings'
import Viewer from './components/Viewer'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Router>
      <Route>
        <Loader />
      </Route>
      <Route path="viewer">
        <Viewer />
      </Route>
      <Route path="settings">
        <Settings />
      </Route>
    </Router>
  )
}

export default App
