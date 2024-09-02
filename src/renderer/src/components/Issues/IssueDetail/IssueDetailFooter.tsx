import { Badge } from '@twilio-paste/core/badge'
import { Box } from '@twilio-paste/core/box'

function IssueDetailFooter(): JSX.Element {
  return (
    <Box
      display="flex"
      columnGap="space40"
      rowGap="space60"
      flexWrap="wrap"
      paddingBottom={'space100'}
    >
      <Badge as="span" size="small" variant="neutral">
        Neutral
      </Badge>
      <Badge as="span" size="small" variant="warning">
        Warning
      </Badge>
      <Badge as="span" size="small" variant="success">
        Success
      </Badge>
      <Badge as="span" size="small" variant="new">
        New
      </Badge>
    </Box>
  )
}

export default IssueDetailFooter
