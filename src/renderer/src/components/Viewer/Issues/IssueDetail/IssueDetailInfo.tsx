import type { Issue } from '@preload/types'
import { Anchor } from '@twilio-paste/core/anchor'
import { Badge } from '@twilio-paste/core/badge'
import { Box } from '@twilio-paste/core/box'
import { Flex } from '@twilio-paste/core/flex'
import { Stack } from '@twilio-paste/core/stack'
import { Text } from '@twilio-paste/core/text'
import { AcceptIcon } from '@twilio-paste/icons/esm/AcceptIcon'

function IssueDetailInfo(props: { issue: Issue }): JSX.Element {
  const { issue } = props

  return (
    <Box display="flex" columnGap="space40" rowGap="space60" flexWrap="wrap">
      <Text as="span" color={'colorTextInverseWeaker'}>
        Created on {issue.dateOpened} by
      </Text>
      <Anchor href={issue.authorURL} target="_blank">
        {issue.author}
      </Anchor>
      {issue.isAdmin && (
        <Badge as="span" variant="subaccount" size="small">
          Admin
        </Badge>
      )}
      <Flex grow></Flex>
      {issue.assignee && (
        <Stack orientation={'horizontal'} spacing="space20">
          <Text as="span" color={'colorTextInverseWeaker'}>
            Assigned to
          </Text>
          <Anchor href={issue.assigneeURL || '#'} target="_blank">
            {issue.assignee}
          </Anchor>
        </Stack>
      )}
      {issue.dateClosed && (
        <Stack orientation={'horizontal'} spacing="space20">
          <AcceptIcon decorative size={'sizeIcon10'} color={'colorTextInverseNew'} />
          <Text as={'strong'} color={'colorTextDecorative40'}>
            Closed on {issue.dateClosed}
          </Text>
        </Stack>
      )}
    </Box>
  )
}

export default IssueDetailInfo
