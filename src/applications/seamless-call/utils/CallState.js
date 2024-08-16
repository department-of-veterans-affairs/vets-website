import {
  CONNECTED,
  ENDED,
  FAILED,
  INITIATED,
  ACCEPTED_INVITE,
  CONFIRMED_INVITE,
  RINGING,
  SENDING_INVITE,
} from '../constants';

export const isInitiated = state => state === INITIATED;

const sipInviteStates = [
  SENDING_INVITE,
  RINGING,
  ACCEPTED_INVITE,
  CONFIRMED_INVITE,
];
export const isInitializing = state =>
  isInitiated(state) || sipInviteStates.includes(state);

export const isActive = state => state === CONNECTED;

export const isEnded = state => state === ENDED;

export const isFailed = state => state === FAILED;

export const callStateDisplay = state => {
  let display = '';
  if (isInitializing(state)) {
    display = 'Calling ...';
  } else if (isActive(state)) {
    display = 'Connected';
  } else if (isEnded(state)) {
    display = 'Call ended';
  } else if (isFailed(state)) {
    display = 'Call failed';
  } else {
    throw new Error(`CallState: unknown state: ${state}`);
  }
  return display;
};
