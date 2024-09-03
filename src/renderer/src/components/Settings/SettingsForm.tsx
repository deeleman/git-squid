import { useRouter } from '@renderer/Router'
import { Button } from '@twilio-paste/core/button'
import { Box } from '@twilio-paste/core/box'
import { Flex } from '@twilio-paste/core/flex'
import { Paragraph } from '@twilio-paste/core/paragraph'
import { Stack } from '@twilio-paste/core/stack'
import { Anchor } from '@twilio-paste/core/anchor'
import { Heading } from '@twilio-paste/core/heading'
import { Label } from '@twilio-paste/core/label'
import { HelpText } from '@twilio-paste/core/help-text'
import { Input } from '@twilio-paste/core/input'
import { ShowIcon } from '@twilio-paste/icons/esm/ShowIcon'
import { HideIcon } from '@twilio-paste/icons/esm/HideIcon'
import { useRef, useState } from 'react'

function SettingsForm(): JSX.Element {
  const { navigate } = useRouter()
  const [token, setToken] = useState('')
  const [url, setURL] = useState('')
  const [tokenVisible, setTokenVisible] = useState(false)
  const [tokenError, setTokenError] = useState(false)
  const [urlError, setURLError] = useState(false)
  const [hasServerError, setServerError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const tokenRegexRef = useRef(
    new RegExp(/^(gh[pous]_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{22,38})$/)
  )
  const urlRegexRef = useRef(/^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/)

  const submitHandler = (): void => {
    const tokenIsValid = tokenRegexRef.current.test(token)
    const urlIsValid = urlRegexRef.current.test(url)
    setTokenError(!tokenIsValid)
    setURLError(!urlIsValid)

    if (tokenIsValid && urlIsValid) {
      processConfigurationUpdate()
    }
  }

  const processConfigurationUpdate = async (): Promise<void> => {
    setIsLoading(true)

    try {
      const [repository, user] = url.split('/').reverse()

      // TODO
      // await updateConfiguration({ url, token, user, repository })

      navigate()
    } catch {
      setServerError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Stack orientation={'vertical'} spacing={'space60'}>
      {hasServerError ? (
        <>
          <Heading as="h1" variant="heading10">
            Oh no! An error has occurred
          </Heading>
          <Paragraph>
            The system was unable to process the configuration update Please make sure that the
            personal access token provided is valid and the repository URL points to an existing
            PUBLIC repository (private repositories are not supported).{' '}
          </Paragraph>
        </>
      ) : (
        <>
          <Heading as="h1" variant="heading10">
            Please configure GitSquid
          </Heading>
          <Paragraph>
            Kindly enter the required Personal Access Token (PAT) and the URL of the public GitHub
            repository below. This allows GitSquid to access the GitHub public API and fetch
            repository issues. You can update this information at any time.{' '}
            <Anchor
              href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
              showExternal
            >
              More info on GitHub tokens
            </Anchor>
          </Paragraph>
        </>
      )}
      <Box>
        <Label htmlFor="personalToken" required>
          Personal Access Token
        </Label>
        <Input
          aria-describedby="personalTokenText"
          id="personalToken"
          name="personalToken"
          type={tokenVisible && !isLoading ? 'text' : 'password'}
          placeholder="ghp_abC123xYz89DefgHijkLm45NOPqrsTuvWxYZ"
          onChange={(e) => setToken(e.target.value)}
          required
          disabled={isLoading}
          value={token}
          insertAfter={
            <Button
              variant="link"
              onClick={() => setTokenVisible(!tokenVisible)}
              disabled={isLoading}
            >
              {tokenVisible && !isLoading ? (
                <HideIcon decorative={false} title="Toggle visibility" size="sizeIcon20" />
              ) : (
                <ShowIcon decorative={false} title="Toggle visibility" size="sizeIcon20" />
              )}
            </Button>
          }
        />
        {tokenError && (
          <HelpText id="personalTokenText" variant="error">
            The data entered does not seem to be a valid personal access token.
          </HelpText>
        )}
      </Box>
      <Box>
        <Label htmlFor="githubRepoURL" required>
          Github repository URL
        </Label>
        <Input
          aria-describedby="githubRepoURLText"
          id="githubRepoURL"
          name="githubRepoURL"
          type="url"
          placeholder="https://github.com/deeleman/git-squid"
          onChange={(e) => setURL(e.target.value)}
          disabled={isLoading}
          value={url}
          required
        />
        {urlError && (
          <HelpText id="githubRepoURLText" variant="error">
            This does not seem a valid URL for a public GitHub repository.
          </HelpText>
        )}
      </Box>
      <Flex hAlignContent={'between'} paddingTop={'space30'}>
        <Button variant="secondary" onClick={() => navigate('viewer')} disabled={isLoading}>
          Cancel and go back
        </Button>
        <Button variant="primary" onClick={submitHandler} loading={isLoading}>
          {isLoading ? 'Validating configuration' : 'Update configuration'}
        </Button>
      </Flex>
    </Stack>
  )
}

export default SettingsForm
