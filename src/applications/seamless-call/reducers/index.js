import {
  AUDIO_DEVICE_CHANGED,
  ENDED,
  CALL_ENDED,
  FAILED,
  CALL_FAILED,
  INITIATED,
  CALL_INITIATED,
  DEFAULT_AUDIO_DEVICE_ID,
  CALL_STATE_CHANGED,
  GOT_REMOTE_TRACK,
  KEYPAD_BUTTON_PRESSED,
  TOGGLE_KEYPAD,
  MUTE_PRESSED,
  SIP_TRANSPORT_STATE_CHANGED,
  AUDIO_INPUT_DEVICE,
  AUDIO_OUTPUT_DEVICE,
} from '../constants';
import { isActive } from '../utils/CallState';

export const initialState = {
  sipTransportState: null,
  sipTransportDisconnectedStatusCode: null,
  state: null,
  errorState: null,
  target: null,
  extraHeaders: [],
  remoteStream: null,
  isMuted: null,
  isKeypadVisible: false,
  keypadPresses: [],
  inputDeviceId: DEFAULT_AUDIO_DEVICE_ID,
  outputDeviceId: DEFAULT_AUDIO_DEVICE_ID,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SIP_TRANSPORT_STATE_CHANGED:
      return {
        ...state,
        sipTransportState: payload.state,
        sipTransportDisconnectedStatusCode: payload.event.error
          ? payload.event.code
          : null,
      };
    case CALL_INITIATED:
      return {
        ...state,
        state: INITIATED,
        target: payload.target,
        extraHeaders: payload.extraHeaders,
        errorState: null,
        isMuted: null,
        keypadPresses: [],
      };
    case GOT_REMOTE_TRACK:
      return {
        ...state,
        remoteStream: payload.event.streams[0],
      };
    case CALL_STATE_CHANGED:
      return {
        ...state,
        state: payload.state,
      };
    case MUTE_PRESSED:
      return {
        ...state,
        isMuted: state.isMuted === null ? true : !state.isMuted,
      };
    case TOGGLE_KEYPAD:
      return {
        ...state,
        isKeypadVisible: !state.isKeypadVisible,
      };
    case KEYPAD_BUTTON_PRESSED:
      return {
        ...state,
        keypadPresses: isActive(state.state)
          ? [...state.keypadPresses, payload.key]
          : state.keypadPresses,
      };
    case AUDIO_DEVICE_CHANGED:
      return {
        ...state,
        inputDeviceId:
          payload.type === AUDIO_INPUT_DEVICE
            ? payload.deviceId
            : state.inputDeviceId,
        outputDeviceId:
          payload.type === AUDIO_OUTPUT_DEVICE
            ? payload.deviceId
            : state.outputDeviceId,
      };
    case CALL_ENDED:
      return {
        ...state,
        state: ENDED,
        remoteStream: null,
      };
    case CALL_FAILED:
      return {
        ...state,
        state: FAILED,
        errorState: payload.event.cause,
      };
    default:
      return state;
  }
};

export default reducer;
