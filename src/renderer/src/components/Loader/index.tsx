import squidIcon from '@renderer/assets/squid-icon.svg'
import { useData, useConfiguration, useRouter } from '@renderer/providers'
import { Box } from '@twilio-paste/core/dist/box'
import { Flex } from '@twilio-paste/core/flex'
import { Heading } from '@twilio-paste/core/heading'
import { Spinner } from '@twilio-paste/core/spinner'
import { useEffect } from 'react'

function Loader(): JSX.Element {
  const { configuration, isReady } = useConfiguration()
  const { load, issues, loading } = useData()
  const { navigate } = useRouter()

  useEffect(() => {
    if (configuration && !isReady) {
      navigate('settings')
    } else if (Array.isArray(issues) && !loading) {
      navigate('viewer')
    } else {
      load()
    }
  }, [configuration, isReady, navigate, load, issues, loading])

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
      <Heading variant="heading10" as="h1">
        GitSquid is initializing...
      </Heading>
      <Spinner
        color="colorTextPrimaryStrong"
        size="sizeIcon100"
        decorative={false}
        title="Loading"
      />
    </Flex>
  )
}

export default Loader
