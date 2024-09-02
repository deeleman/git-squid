import { Anchor } from '@twilio-paste/core/anchor'
import { Badge } from '@twilio-paste/core/badge'
import { Box } from '@twilio-paste/core/box'
import { Flex } from '@twilio-paste/core/flex'
import { Stack } from '@twilio-paste/core/stack'
import { Text } from '@twilio-paste/core/text'
import { AcceptIcon } from '@twilio-paste/icons/esm/AcceptIcon'

function IssueDetailInfo(): JSX.Element {
  return (
    <Box display="flex" columnGap="space40" rowGap="space60" flexWrap="wrap">
      <Text as="span" color={'colorTextInverseWeaker'}>
        Created on Jul 11 by
      </Text>
      <Anchor href="#">vignesh-sivaprakasam</Anchor>
      <Badge as="span" variant="subaccount" size="small">
        Admin
      </Badge>
      <Flex grow></Flex>
      <Stack orientation={'horizontal'} spacing="space20">
        <Text as="span" color={'colorTextInverseWeaker'}>
          Assigned to
        </Text>
        <Anchor href="#">deeleman</Anchor>
      </Stack>
      <Stack orientation={'horizontal'} spacing="space20">
        <AcceptIcon decorative size={'sizeIcon10'} color={'colorTextInverseNew'} />
        <Text as={'strong'} color={'colorTextDecorative40'}>
          Closed on Jul 23
        </Text>
      </Stack>
    </Box>
  )
}

export default IssueDetailInfo
