import squidIcon from '@renderer/assets/squid-icon.svg'
import { useConfiguration } from '@renderer/providers/configuration'
import { useRouter } from '@renderer/providers/router'
import { Box } from '@twilio-paste/core/dist/box'
import { Flex } from '@twilio-paste/core/flex'
import { Heading } from '@twilio-paste/core/heading'
import { Spinner } from '@twilio-paste/core/spinner'
import { useEffect } from 'react'

function Loader(): JSX.Element {
  const { configuration } = useConfiguration()
  const { navigate } = useRouter()

  useEffect(() => {
    if (configuration && (!configuration.token || !configuration.url)) {
      navigate('settings')
    } else {
      navigate('viewer') // TODO: Validate that there is data available before redirecting
    }
  }, [configuration, navigate])

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
