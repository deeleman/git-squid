import type { Issue } from '@preload/types'
import { Box } from '@twilio-paste/core/box'
import MarkdownBlock from './MarkdownBlock'
import { Text } from '@twilio-paste/core/text'

function IssueDetailBody(props: { issue: Issue }): JSX.Element {
  const { issue } = props

  return (
    <Box marginY={'space100'} as="article">
      {issue ? (
        <MarkdownBlock>{issue.body}</MarkdownBlock>
      ) : (
        <Box textAlign={'center'}>
          <Text as="h3" fontSize={'fontSize40'} color={'colorTextWeak'}>
            Not much to see here now...
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default IssueDetailBody
