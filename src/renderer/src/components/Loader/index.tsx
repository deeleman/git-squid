import squidIcon from '@renderer/assets/squid-icon.svg'
import { useRouter } from '@renderer/Router'
import { Box } from '@twilio-paste/core/dist/box'
import { Button } from '@twilio-paste/core/button'
import { Flex } from '@twilio-paste/core/flex'
import { Heading } from '@twilio-paste/core/heading'
import { Spinner } from '@twilio-paste/core/spinner'

function Loader(): JSX.Element {
  const { navigate } = useRouter()

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
        Loading GitSquid...
      </Heading>
      <Spinner
        color="colorTextPrimaryStrong"
        size="sizeIcon100"
        decorative={false}
        title="Loading"
      />
      <Button variant="destructive" onClick={() => navigate('index')}>
        Cancel
      </Button>
    </Flex>
  )
}

export default Loader
