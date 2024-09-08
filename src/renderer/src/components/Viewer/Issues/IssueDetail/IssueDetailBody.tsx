import type { Issue } from '@preload/types'
import { Box } from '@twilio-paste/core/box'
import MarkdownBlock from './MarkdownBlock'

function IssueDetailBody(props: { issue: Issue }): JSX.Element {
  const { issue } = props

  return (
    <Box marginY={'space100'} as="article">
      <MarkdownBlock>{issue.body}</MarkdownBlock>
    </Box>
  )
}

export default IssueDetailBody
