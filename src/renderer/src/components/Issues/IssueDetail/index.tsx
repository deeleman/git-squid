import { Box } from '@twilio-paste/core/box'
import IssueDetailBody from './IssueDetailBody'
import IssueDetailFooter from './IssueDetailFooter'
import IssueDetailHeader from './IssueDetailHeader'
import IssueDetailInfo from './IssueDetailInfo'

function IssueDetail(): JSX.Element {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      width={'100%'}
      height={'100vh'}
      maxHeight={'100vh'}
      borderColor={'colorBorderWeak'}
      borderLeftWidth={'borderWidth10'}
      borderLeftStyle={'solid'}
    >
      <IssueDetailHeader />
      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'100%'}
        height={'100%'}
        overflow={'auto'}
        paddingX={'space80'}
        paddingY={'space50'}
      >
        <IssueDetailInfo />
        <IssueDetailBody />
        <IssueDetailFooter />
      </Box>
    </Box>
  )
}

export default IssueDetail
