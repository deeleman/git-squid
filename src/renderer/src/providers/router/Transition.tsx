import { styled } from '@twilio-paste/core/styling-library'
import { Box } from '@twilio-paste/core/box'

/**
 * Animation wrapper to provide a smooth enter transition to any contained element upon mounting.
 */
const Transition = styled(Box)`
  @keyframes fadeIn {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  animation: fadeIn 0.6s normal forwards;
`

export default Transition
