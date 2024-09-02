import { Flex } from '@twilio-paste/core/flex'
import Issues from './Issues'
import Toolbar from './Toolbar'

function Viewer(): JSX.Element {
  return (
    <Flex grow vAlignContent={'stretch'}>
      <Toolbar />
      <Issues />
    </Flex>
  )
}

export default Viewer
