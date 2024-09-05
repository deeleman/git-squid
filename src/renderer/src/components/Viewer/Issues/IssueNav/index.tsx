import type { Issues } from '@preload/types'
import { useConfiguration } from '@renderer/providers'
import { Badge } from '@twilio-paste/core/badge'
import { Box } from '@twilio-paste/core/box'
import { Flex } from '@twilio-paste/core/flex'
import { Heading } from '@twilio-paste/core/heading'
import { Input } from '@twilio-paste/core/input'
import { Stack } from '@twilio-paste/core/stack'
import { Tooltip } from '@twilio-paste/core/tooltip'
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon'
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon'
import { useMemo } from 'react'

type IssueNavProps = {
  issues: Issues
  onSearch: (keyword: string) => void
}

function IssueNav(props: IssueNavProps): JSX.Element {
  const { configuration } = useConfiguration()
  const { issues, onSearch } = props

  const unreadIssues = useMemo(() => {
    return issues.filter((issue) => !issue.read).length
  }, [issues])

  return (
    <Box
      width={'100%'}
      minHeight={'118px'}
      borderLeftStyle={'solid'}
      borderBottomStyle={'solid'}
      borderColor={'colorBorderWeak'}
      borderLeftWidth={'borderWidth10'}
      borderBottomWidth={'borderWidth10'}
      paddingX={'space40'}
    >
      <Stack orientation={'vertical'} spacing={'space60'}>
        <Flex as="header" vAlignContent={'center'} paddingTop={'space60'}>
          <Heading as="h2" variant="heading40" marginBottom="space0">
            {issues.length} GitHub Issues
          </Heading>
          {unreadIssues > 0 && (
            <Flex marginLeft={'space40'}>
              <Tooltip text={`View your ${unreadIssues} unread issues`} placement="auto">
                <Badge as="span" size="small" variant="notification_counter">
                  {unreadIssues > 99 ? '+99' : unreadIssues}
                </Badge>
              </Tooltip>
            </Flex>
          )}
          <Flex grow hAlignContent={'right'}>
            <Tooltip text="Create new issue" placement="auto">
              <Badge
                as="a"
                href={`${configuration?.url}/issues/new`}
                target="_blank"
                variant="brand20"
              >
                <EditIcon decorative={false} title="Create new issue" />
              </Badge>
            </Tooltip>
          </Flex>
        </Flex>
        <Input
          name="filter"
          type="search"
          placeholder="Filter by keyword"
          onChange={(e): void => onSearch(e.target.value || '')}
          insertAfter={<SearchIcon decorative size="sizeIcon20" />}
        />
      </Stack>
    </Box>
  )
}

export default IssueNav
