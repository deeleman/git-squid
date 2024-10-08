import type { Issue, Issues } from '@preload/types'
import { Badge } from '@twilio-paste/core/badge'
import { Box } from '@twilio-paste/core/box'
import { Flex } from '@twilio-paste/core/flex'
import { Spinner } from '@twilio-paste/core/spinner'
import { Stack } from '@twilio-paste/core/stack'
import { Text } from '@twilio-paste/core/text'
import { useCallback, useEffect, useMemo, useRef } from 'react'

type IssueListProps = {
  issues: Issues
  loading?: boolean
  selectedIssue?: Issue
  onSelectIssue: (issue: Issue) => void
  onScrollEnd: () => void
}

/**
 * Reflects the average height (in pixels) of an item in the nav list
 */
const AVG_ITEM_HEIGHT = 100

function IssueList(props: IssueListProps): JSX.Element {
  const { issues, onSelectIssue, loading, onScrollEnd, selectedIssue } = props
  const loadOnScrollRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]): void => {
      if (entry.isIntersecting && !loading) {
        onScrollEnd()
      }
    })

    if (loadOnScrollRef.current) {
      observer.observe(loadOnScrollRef.current)
    }

    return (): void => {
      if (loadOnScrollRef.current) {
        observer.unobserve(loadOnScrollRef.current)
      }
    }
  }, [loadOnScrollRef.current, loading, onScrollEnd])

  const triggerLoadOnScrollWaypointIndex = useMemo(() => {
    const averageItemHeight =
      Array.from(document.querySelectorAll('.issue-item') || [])
        .map((item) => item.clientHeight)
        .reduce((sum, itemHeight) => sum + itemHeight, 0) / issues.length || AVG_ITEM_HEIGHT

    const itemsInViewport = Math.floor(window.innerHeight / averageItemHeight) - 1

    return issues.length <= itemsInViewport
      ? issues.length - 1
      : issues.length - itemsInViewport + 1
  }, [issues])

  const bindLoadOnScrollRef = useCallback(
    (index: number): { ref?: typeof loadOnScrollRef } => {
      if (index === triggerLoadOnScrollWaypointIndex) {
        return {
          ref: loadOnScrollRef
        }
      }

      return { ref: undefined }
    },
    [triggerLoadOnScrollWaypointIndex]
  )

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      height={'100%'}
      overflow={'auto'}
      width={'300px'}
    >
      {issues.map((issue, index) => (
        <Box
          className="issue-item"
          {...bindLoadOnScrollRef(index)}
          key={issue.id}
          borderBottomColor={'colorBorderWeak'}
          borderBottomWidth={'borderWidth10'}
          borderBottomStyle={'solid'}
          borderLeftColor={
            issue.state === 'closed' || issue.dateClosed
              ? 'colorBorderNewWeaker'
              : 'colorBorderSuccessWeak'
          }
          borderLeftWidth={'borderWidth30'}
          borderLeftStyle={'solid'}
          overflowX={'clip'}
          paddingX={'space50'}
          paddingY={'space40'}
          cursor={'pointer'}
          transition={'border-left-width 0.3s'}
          backgroundColor={
            selectedIssue?.id === issue.id ? 'colorBackgroundPrimaryWeaker' : undefined
          }
          _hover={{
            backgroundColor:
              selectedIssue?.id === issue.id
                ? 'colorBackgroundPrimaryWeaker'
                : 'colorBackgroundPrimaryWeakest',
            borderLeftWidth: 'borderWidth40'
          }}
          onClick={() => onSelectIssue(issue)}
        >
          <Stack orientation={'vertical'} spacing="space30">
            <Text
              as="h3"
              fontSize={'fontSize30'}
              fontWeight={issue.read ? 'fontWeightMedium' : 'fontWeightBold'}
            >
              {issue.title}
            </Text>
            <Flex hAlignContent={'between'}>
              <Flex grow>
                <Text as="p" fontSize={'fontSize20'} color={'colorTextIcon'}>
                  Opened on {issue.dateOpened} by {issue.author}
                </Text>
              </Flex>
              {issue.isNew && !issue.read && (
                <Flex>
                  <Badge variant="decorative30" as="span" size="small">
                    NEW
                  </Badge>
                </Flex>
              )}
            </Flex>
          </Stack>
        </Box>
      ))}
      <Box
        borderLeftColor={'colorBorderWeak'}
        borderLeftWidth={'borderWidth10'}
        borderLeftStyle={'solid'}
        flexGrow={'inherit'}
        height={'100%'}
      >
        <Flex hAlignContent={'center'} vAlignContent={'center'} paddingY={'space60'} width={'100%'}>
          {loading ? (
            <Spinner
              color="colorTextPrimaryStrong"
              size="sizeIcon50"
              decorative={false}
              title="Loading"
            />
          ) : (
            <Text as="h4" fontSize={'fontSize20'} color={'colorTextWeaker'}>
              No more issues to load
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  )
}

export default IssueList
