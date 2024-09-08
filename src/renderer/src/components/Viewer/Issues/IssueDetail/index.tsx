import squidIcon from '@renderer/assets/squid-icon.svg'
import type { Issue } from '@preload/types'
import { Box } from '@twilio-paste/core/box'
import { Text } from '@twilio-paste/core/text'
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
      <IssueDetailHeader issue={issue} />
      {issue ? (
        <Box
          display={'flex'}
          flexDirection={'column'}
          height={'100%'}
          overflowY={'auto'}
          paddingX={'space80'}
          paddingY={'space50'}
        >
          <IssueDetailInfo issue={issue} />
          <Box position={'relative'} height={'100%'} flexGrow={'inherit'}>
            <Box position={'absolute'} height={'100%'} right={0} left={0} top={0} bottom={0}>
              <IssueDetailBody issue={issue} />
              <IssueDetailFooter issue={issue} />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          display={'flex'}
          flexDirection={'column'}
          height={'100%'}
          padding={'space80'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Box opacity={0.8} as="img" src={squidIcon} maxWidth={'96px'} marginBottom={'space80'} />
          <Text
            as="p"
            fontWeight={'fontWeightBold'}
            fontSize={'fontSize70'}
            color={'colorTextPrimaryStrong'}
          >
            Nothing to see here just yet...
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default IssueDetail
