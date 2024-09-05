import { useData } from '@renderer/providers'
import { Flex } from '@twilio-paste/core/flex'
import IssueDetail from './IssueDetail'
import IssueList from './IssueList'
import IssueNav from './IssueNav'
import { useEffect, useMemo, useState } from 'react'
import type { Issue } from '@preload/types'

function Issues(): JSX.Element {
  const [keyword, setKeyword] = useState('')
  const [selectedIssue, setSelectedIssue] = useState<Issue>()
  const { issues, read, loading, load } = useData()

  const filteredIssues = useMemo(() => {
    if (issues && keyword && keyword.length >= 3) {
      return issues?.filter((issue) => issue.title.includes(keyword))
    }

    return issues || []
  }, [issues, keyword])

  useEffect(() => {
    if (selectedIssue) {
      read(selectedIssue)
    }
  }, [selectedIssue])

  useEffect(() => {
    if (Array.isArray(issues) && issues.length > 0 && !selectedIssue) {
      setSelectedIssue(issues[0])
    }
  }, [selectedIssue, issues])

  return (
    <Flex grow maxHeight={'100vh'} vAlignContent={'stretch'}>
      <Flex minWidth={'300px'} height={'100vh'} vertical>
        <IssueNav
          issues={filteredIssues}
          onSearch={setKeyword}
          onRefresh={() => load(true)}
          loading={loading}
        />
        <IssueList
          issues={filteredIssues}
          onSelectIssue={setSelectedIssue}
          loading={loading}
          onScrollEnd={load}
        />
      </Flex>
      <IssueDetail issue={selectedIssue} />
    </Flex>
  )
}

export default Issues
