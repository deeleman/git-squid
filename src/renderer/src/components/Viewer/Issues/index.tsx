import { Flex } from '@twilio-paste/core/flex'
import IssueDetail from './IssueDetail'
import IssueList from './IssueList'
import IssueNav from './IssueNav'

function Issues(): JSX.Element {
  return (
    <Flex grow maxHeight={'100vh'} vAlignContent={'stretch'}>
      <Flex minWidth={'280px'} height={'100vh'} vertical>
        <IssueNav />
        <IssueList />
      </Flex>
      <IssueDetail />
    </Flex>
  )
}

export default Issues
