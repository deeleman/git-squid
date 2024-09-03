import squidIcon from '@renderer/assets/squid-icon.svg'
import { Box } from '@twilio-paste/core/box'
import { Flex } from '@twilio-paste/core/flex'
import SettingsForm from './SettingsForm'

function Settings(): JSX.Element {
  return (
    <Flex
      width={'100vw'}
      height={'100vh'}
      vAlignContent={'stretch'}
      hAlignContent={'center'}
      vertical
    >
      <Box as="header" paddingBottom={'space100'} width={'100vw'}></Box>
      <Flex
        grow
        vertical
        vAlignContent={'center'}
        hAlignContent={'center'}
        marginBottom={'space100'}
      >
        <Flex>
          <Box as="img" src={squidIcon} maxWidth={'164px'} />
          <Box
            borderColor={'colorBorderWeak'}
            borderLeftStyle={'solid'}
            borderLeftWidth={'borderWidth10'}
            paddingLeft={'space100'}
            paddingRight={'space80'}
            maxWidth={'700px'}
          >
            <SettingsForm />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Settings
