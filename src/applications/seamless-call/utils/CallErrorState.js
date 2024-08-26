import jssip from './JsSipWrapper';

const { USER_DENIED_MEDIA_ACCESS, UNAVAILABLE, CANCELED } = jssip.C.causes;
const callErrorStateDisplaysByJsSIPCause = {
  [USER_DENIED_MEDIA_ACCESS]: 'User denied media access',
  [UNAVAILABLE]: 'No answer',
  [CANCELED]: 'Call canceled',
};
export const callErrorStateDisplay = state => {
  const display = callErrorStateDisplaysByJsSIPCause[state];
  if (!display) {
    throw new Error(`CallErrorState: unknown state: ${state}`);
  }

  return display;
};
