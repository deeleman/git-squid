import squidIcon from '@renderer/assets/squid-icon.svg'
import { useRouter } from '@renderer/providers'
import { Box } from '@twilio-paste/core/box'
import { Button } from '@twilio-paste/core/button'
import { Flex } from '@twilio-paste/core/flex'
import { Stack } from '@twilio-paste/core/stack'
import { Text } from '@twilio-paste/core/text'
import { Tooltip } from '@twilio-paste/core/tooltip'
import { ProductSettingsIcon } from '@twilio-paste/icons/esm/ProductSettingsIcon'

function Toolbar(): JSX.Element {
  const { navigate } = useRouter()

  return (
    <Flex
      minWidth={'82px'}
      height={'100vh'}
      vAlignContent={'center'}
      hAlignContent={'between'}
      paddingBottom={'space60'}
      vertical
    >
      <Flex hAlignContent={'center'} grow>
        <Stack as="header" orientation={'vertical'} spacing={'space20'}>
          <Box as="img" src={squidIcon} maxWidth={'56px'} paddingTop={'space140'} />
          <Text textAlign={'center'} as="h1" color="colorTextWeak" fontSize={'fontSize20'}>
            GitSquid
          </Text>
        </Stack>
      </Flex>
      <Flex hAlignContent={'center'}>
        <Tooltip text="Update token and settings" placement="auto">
          <Button variant="secondary" size="circle" onClick={(): void => navigate('settings')}>
            <ProductSettingsIcon decorative={false} title="Update config" />
          </Button>
        </Tooltip>
      </Flex>
    </Flex>
  )
}

export default Toolbar
