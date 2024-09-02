import { Anchor } from '@twilio-paste/core/anchor'
import { Box } from '@twilio-paste/core/box'
import { Flex } from '@twilio-paste/core/flex'
import { Heading } from '@twilio-paste/core/heading'
import { Text } from '@twilio-paste/core/text'
import { Tooltip } from '@twilio-paste/core/tooltip'
import { GitIcon } from '@twilio-paste/icons/esm/GitIcon'
import { LockIcon } from '@twilio-paste/icons/esm/LockIcon'
import { SuccessIcon } from '@twilio-paste/icons/esm/SuccessIcon'

function IssueDetailTitle(): JSX.Element {
  return (
    <Box
      as="header"
      borderColor={'colorBorderWeak'}
      borderBottomStyle={'solid'}
      borderBottomWidth={'borderWidth10'}
      backgroundColor={'colorBackgroundRowStriped'}
    >
      <Flex padding={'space60'} vertical minHeight={'117px'} hAlignContent={'between'}>
        <Flex hAlignContent={'right'}>
          <Tooltip text="Go to repo at github.com">
            <Text fontWeight={'fontWeightBold'} as={'p'} marginBottom={'space40'}>
              <Anchor href="https://github.com/deeleman">
                <Flex>
                  <Flex marginRight={'space10'}>
                    <GitIcon decorative />
                  </Flex>
                  <Flex>deeleman/load-engine-foo</Flex>
                </Flex>
              </Anchor>
            </Text>
          </Tooltip>
        </Flex>
        <Flex grow vAlignContent={'bottom'}>
          <Heading as="h3" variant="heading20" marginBottom="space0">
            <Flex vAlignContent={'top'}>
              <Tooltip text="This issue is locked">
                <Flex marginRight={'space30'} marginTop={'space20'} minWidth={'24px'}>
                  <LockIcon
                    decorative={false}
                    size={'sizeIcon40'}
                    title="Issue closed"
                    color={'colorTextIcon'}
                  />
                </Flex>
              </Tooltip>
              <Tooltip text="Issue open">
                <Flex marginRight={'space30'} marginTop={'space20'} minWidth={'24px'}>
                  {/* <ProcessInProgressIcon
                        decorative={false}
                        size={'sizeIcon40'}
                        title="Open issue"
                        color={'colorTextIconSuccess'}
                      /> */}
                  <SuccessIcon
                    decorative={false}
                    size={'sizeIcon40'}
                    title="Issue closed"
                    color={'colorTextInverseNew'}
                  />
                </Flex>
              </Tooltip>
              <Flex>
                {/* How do I move a frameless window in Electron without using -webkit-app-region */}
                Hello world
              </Flex>
            </Flex>
          </Heading>
        </Flex>
      </Flex>
    </Box>
  )
}

export default IssueDetailTitle
