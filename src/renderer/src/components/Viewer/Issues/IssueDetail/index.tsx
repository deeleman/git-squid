import type { Issue } from '@preload/types'
import { Box } from '@twilio-paste/core/box'
import IssueDetailBody from './IssueDetailBody'
import IssueDetailFooter from './IssueDetailFooter'
import IssueDetailHeader from './IssueDetailHeader'
import IssueDetailInfo from './IssueDetailInfo'

function IssueDetail(props: { issue?: Issue }): JSX.Element {
  const { issue } = props

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
      {issue && (
        <>
          <IssueDetailHeader issue={issue} />
          <Box
            display={'flex'}
            flexDirection={'column'}
            height={'100%'}
            overflowY={'auto'}
            paddingX={'space80'}
            paddingY={'space50'}
          >
            <IssueDetailInfo issue={issue} />
            <Box position={'relative'}>
              <Box position={'absolute'} right={0} left={0}>
                <IssueDetailBody issue={issue} />
                <IssueDetailFooter issue={issue} />
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

export default IssueDetail
