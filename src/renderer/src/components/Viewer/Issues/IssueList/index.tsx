import type { Issue, Issues } from '@preload/types'
import { Box } from '@twilio-paste/core/box'
import { Flex } from '@twilio-paste/core/flex'
import { Spinner } from '@twilio-paste/core/spinner'
import { Stack } from '@twilio-paste/core/stack'
import { Text } from '@twilio-paste/core/text'
import { useEffect, useRef } from 'react'

type IssueListProps = {
  issues: Issues
  loading?: boolean
  onSelectIssue: (issue: Issue) => void
  onScrollEnd: () => void
}

function IssueList(props: IssueListProps): JSX.Element {
  const { issues, onSelectIssue, loading, onScrollEnd } = props
  const loaderRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]): void => {
      if (entry.isIntersecting && !loading) {
        onScrollEnd()
      }
    })

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return (): void => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [loaderRef.current, loading, onScrollEnd])

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      height={'100%'}
      overflow={'auto'}
      minWidth={'300px'}
      width={'300px'}
    >
      {issues.map((issue) => (
        <Box
          key={issue.id}
          minWidth={'300px'}
          width={'300px'}
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
          paddingX={'space50'}
          paddingY={'space40'}
          cursor={'pointer'}
          transition={'border-left-width 0.3s'}
          _hover={{
            backgroundColor: 'colorBackgroundBrandHighlightWeakest',
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
            <Text as="p" fontSize={'fontSize20'} color={'colorTextIcon'}>
              Opened on {issue.dateOpened} by {issue.author}
            </Text>
          </Stack>
        </Box>
      ))}
      <Box
        ref={loaderRef}
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
