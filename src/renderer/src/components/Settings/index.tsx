import squidIcon from '@renderer/assets/squid-icon.svg'
import { useRouter } from '@renderer/Router'
import { Button } from '@twilio-paste/core/button'
import { Box } from '@twilio-paste/core/box'
import { Flex } from '@twilio-paste/core/flex'
import { Text } from '@twilio-paste/core/text'

function Settings(): JSX.Element {
  const { navigate } = useRouter()

  return (
    <Flex width={'100vw'} height={'100vh'} vAlignContent={'center'} vertical>
      <Box as="img" src={squidIcon} maxWidth={'56px'} paddingTop={'space140'} />
      <Text textAlign={'center'} as="h1" color="colorTextWeak" fontSize={'fontSize20'}>
        GitSquid Settings
      </Text>
      <Button variant="secondary" onClick={() => navigate('loader')}>
        Submit
      </Button>
    </Flex>
  )
}

export default Settings
