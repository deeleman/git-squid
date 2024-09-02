import { Flex } from '@twilio-paste/core/flex'
import Issues from './components/Issues'
import Toolbar from './components/Toolbar'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Flex grow vAlignContent={'stretch'}>
      <Toolbar />
      <Issues />
    </Flex>
  )
}

export default App
