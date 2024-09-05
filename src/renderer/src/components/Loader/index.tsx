import squidIcon from '@renderer/assets/squid-icon.svg'
import { useData, useConfiguration, useRouter } from '@renderer/providers'
import { Paragraph } from '@twilio-paste/core/paragraph'
import { CodeBlock } from '@twilio-paste/core/code-block'
import { Box } from '@twilio-paste/core/dist/box'
import { Flex } from '@twilio-paste/core/flex'
import { Heading } from '@twilio-paste/core/heading'
import { Spinner } from '@twilio-paste/core/spinner'
import { useEffect } from 'react'

function Loader(): JSX.Element {
  const { configuration, isReady } = useConfiguration()
  const { load, issues, loading, error } = useData()
  const { navigate } = useRouter()

  useEffect(() => {
    if (configuration && !isReady) {
      navigate('settings')
    } else if (isReady && !issues && !loading && !error) {
      load()
    } else if (issues && !loading) {
      navigate('viewer')
    }
  }, [configuration, isReady, navigate, issues, load, loading, error])

  return (
    <Flex
      as="header"
      width={'100vw'}
      height={'100vh'}
      vAlignContent={'center'}
      hAlignContent={'center'}
      vertical
    >
      <Box as="img" src={squidIcon} maxWidth={'128px'} marginBottom={'space100'} />
      {error ? (
        <>
          <Heading variant="heading10" as="h1">
            Oh no!
          </Heading>
          <Heading variant="heading30" as="h2">
            An error has been detected
          </Heading>
          <Paragraph>
            The system cannot operate right now due to an error while fetching issues. You can find
            more details below:
          </Paragraph>
          <CodeBlock variant="single-line" language="shell" code={error} />
        </>
      ) : (
        <>
          <Heading variant="heading10" as="h1">
            GitSquid is initializing...
          </Heading>
          <Spinner
            color="colorTextPrimaryStrong"
            size="sizeIcon100"
            decorative={false}
            title="Loading"
          />
        </>
      )}
    </Flex>
  )
}

export default Loader
