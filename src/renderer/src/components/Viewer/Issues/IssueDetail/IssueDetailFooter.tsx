/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Issue } from '@preload/types'
import { Badge } from '@twilio-paste/core/badge'
import { Box } from '@twilio-paste/core/box'

function getBadgeColor(index: number): any {
  if (index % 4 === 0) return 'neutral'
  if (index % 3 === 0) return 'warning'
  if (index % 2 === 0) return 'success'
  return 'new' as any
}

function IssueDetailFooter(props: { issue: Issue }): JSX.Element {
  const { issue } = props

  return issue.labels ? (
    <Box
      display="flex"
      columnGap="space40"
      rowGap="space60"
      flexWrap="wrap"
      paddingBottom={'space100'}
    >
      {issue.labels.map((label, index) => (
        <Badge key={label} as="span" size="small" variant={getBadgeColor(index)}>
          {label}
        </Badge>
      ))}
    </Box>
  ) : (
    <></>
  )
}

export default IssueDetailFooter
