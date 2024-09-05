import { Route, Router } from './providers'
import Loader from './components/Loader'
import Settings from './components/Settings'
import Viewer from './components/Viewer'

function App(): JSX.Element {
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
