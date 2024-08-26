import {
  ACCEPTED_INVITE,
  AUDIO_INPUT_DEVICE,
  AUDIO_OUTPUT_DEVICE,
  CALL_ENDED,
  CALL_FAILED,
  CALL_INITIATED,
  CALL_STATE_CHANGED,
  CONFIRMED_INVITE,
  CONNECTED,
  GOT_REMOTE_TRACK,
  AUDIO_DEVICE_CHANGED,
  KEYPAD_BUTTON_PRESSED,
  TOGGLE_KEYPAD,
  MUTE_PRESSED,
  RINGING,
  SENDING_INVITE,
  SIP_TRANSPORT_CONNECTED,
  SIP_TRANSPORT_CONNECTING,
  SIP_TRANSPORT_DISCONNECTED,
  SIP_TRANSPORT_STATE_CHANGED,
} from '../constants';

export const sipTransportConnecting = event => ({
  type: SIP_TRANSPORT_STATE_CHANGED,
  payload: {
    state: SIP_TRANSPORT_CONNECTING,
    event,
  },
});

export const sipTransportConnected = event => ({
  type: SIP_TRANSPORT_STATE_CHANGED,
  payload: {
    state: SIP_TRANSPORT_CONNECTED,
    event,
  },
});

export const sipTransportDisconnected = event => ({
  type: SIP_TRANSPORT_STATE_CHANGED,
  payload: {
    state: SIP_TRANSPORT_DISCONNECTED,
    event,
  },
});

export const callInitiated = (target, extraHeaders) => ({
  type: CALL_INITIATED,
  payload: {
    target,
    extraHeaders,
  },
});

export const sendingInvite = event => ({
  type: CALL_STATE_CHANGED,
  payload: { state: SENDING_INVITE, event },
});

export const ringing = event => ({
  type: CALL_STATE_CHANGED,
  payload: { state: RINGING, event },
});

export const gotRemoteTrack = event => ({
  type: GOT_REMOTE_TRACK,
  payload: { event },
});

export const acceptedInvite = event => ({
  type: CALL_STATE_CHANGED,
  payload: { state: ACCEPTED_INVITE, event },
});

export const confirmedInvite = event => ({
  type: CALL_STATE_CHANGED,
  payload: { state: CONFIRMED_INVITE, event },
});

export const callConnected = event => ({
  type: CALL_STATE_CHANGED,
  payload: { state: CONNECTED, event },
});

export const mutePressed = () => ({
  type: MUTE_PRESSED,
});

export const toggleKeypad = () => ({
  type: TOGGLE_KEYPAD,
});

export const keypadButtonPressed = key => ({
  type: KEYPAD_BUTTON_PRESSED,
  payload: { key },
});

export const audioInputDeviceChanged = deviceId => ({
  type: AUDIO_DEVICE_CHANGED,
  payload: { deviceId, type: AUDIO_INPUT_DEVICE },
});

export const audioOutputDeviceChanged = deviceId => ({
  type: AUDIO_DEVICE_CHANGED,
  payload: { deviceId, type: AUDIO_OUTPUT_DEVICE },
});

export const callEnded = event => ({
  type: CALL_ENDED,
  payload: { event },
});

export const callFailed = event => ({
  type: CALL_FAILED,
  payload: { event },
});
