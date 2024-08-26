import { expect } from 'chai';
import {
  acceptedInvite,
  audioInputDeviceChanged,
  audioOutputDeviceChanged,
  callConnected,
  callEnded,
  callFailed,
  callInitiated,
  confirmedInvite,
  gotRemoteTrack,
  keypadButtonPressed,
  mutePressed,
  ringing,
  sendingInvite,
  sipTransportConnected,
  sipTransportConnecting,
  sipTransportDisconnected,
  toggleKeypad,
} from '../../actions';
import {
  ACCEPTED_INVITE,
  CONFIRMED_INVITE,
  CONNECTED,
  ENDED,
  FAILED,
  INITIATED,
  RINGING,
  SENDING_INVITE,
  SIP_TRANSPORT_CONNECTED,
  SIP_TRANSPORT_CONNECTING,
  SIP_TRANSPORT_DISCONNECTED,
} from '../../constants';
import reducer, { initialState } from '../../reducers';
import jssip from '../../utils/JsSipWrapper';
import { createUaDisconnectedErrorEvent } from '../test-helpers/CallTestFactories';

describe('reducer', () => {
  it('returns the initial state given an undefined initial state', () => {
    const newState = reducer(undefined, {});

    expect(newState).to.eql(initialState);
  });

  it('returns the state unchanged given an unknown action type', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
    };

    const newState = reducer(initialState, action);

    expect(newState).to.eql(initialState);
  });

  describe('sipTransportConnecting', () => {
    it('sets SIP transport state to connecting', () => {
      const event = {};
      const action = sipTransportConnecting(event);

      const { sipTransportState } = reducer(initialState, action);

      expect(sipTransportState).to.eql(SIP_TRANSPORT_CONNECTING);
    });
  });

  describe('sipTransportConnected', () => {
    it('sets SIP transport state to connected', () => {
      const event = {};
      const action = sipTransportConnected(event);

      const { sipTransportState } = reducer(initialState, action);

      expect(sipTransportState).to.eql(SIP_TRANSPORT_CONNECTED);
    });
  });

  describe('sipTransportDisconnected', () => {
    it('sets SIP transport state to disconnected', () => {
      const event = {};
      const action = sipTransportDisconnected(event);

      const { sipTransportState } = reducer(initialState, action);

      expect(sipTransportState).to.eql(SIP_TRANSPORT_DISCONNECTED);
    });

    it('sets SIP transport disconnected status code when there is an error', () => {
      const event = createUaDisconnectedErrorEvent();
      const action = sipTransportDisconnected(event);

      const { sipTransportDisconnectedStatusCode } = reducer(
        initialState,
        action,
      );

      expect(sipTransportDisconnectedStatusCode).to.eql(event.code);
    });

    it('does not set SIP transport disconnected status code when there is not an error', () => {
      const event = { error: false, code: 1 };
      const action = sipTransportDisconnected(event);

      const { sipTransportDisconnectedStatusCode } = reducer(
        initialState,
        action,
      );

      expect(sipTransportDisconnectedStatusCode).to.eql(null);
    });
  });

  describe('callInitiated', () => {
    it('sets call info', () => {
      const newTarget = 'sip:bob@sip.local';
      const newExtraHeaders = ['X-Header: value'];
      const action = callInitiated(newTarget, newExtraHeaders);

      const { state, target, extraHeaders } = reducer(initialState, action);

      expect(state).to.eql(INITIATED);
      expect(target).to.eql(newTarget);
      expect(extraHeaders).to.eql(newExtraHeaders);
    });

    it('resets previous call state', () => {
      const previousState = {
        ...initialState,
        errorState: jssip.C.causes.UNAVAILABLE,
        isMuted: true,
        keypadPresses: ['1'],
      };
      const action = callInitiated();

      const { errorState, isMuted, keypadPresses } = reducer(
        previousState,
        action,
      );

      expect(errorState).to.be.null;
      expect(isMuted).to.be.null;
      expect(keypadPresses).to.be.eql([]);
    });
  });

  describe('sendingInviate', () => {
    it('sets call state', () => {
      const event = {};
      const action = sendingInvite(event);

      const { state } = reducer(initialState, action);

      expect(state).to.eql(SENDING_INVITE);
    });
  });

  describe('ringing', () => {
    it('sets call state', () => {
      const event = {};
      const action = ringing(event);

      const { state } = reducer(initialState, action);

      expect(state).to.eql(RINGING);
    });
  });

  describe('gotRemoteTrack', () => {
    it('sets remote stream', () => {
      const event = { streams: [{ id: '123' }] };
      const action = gotRemoteTrack(event);

      const { remoteStream } = reducer(initialState, action);

      expect(remoteStream).to.eql(event.streams[0]);
    });
  });

  describe('acceptedInvite', () => {
    it('sets call state', () => {
      const event = {};
      const action = acceptedInvite(event);

      const { state } = reducer(initialState, action);

      expect(state).to.eql(ACCEPTED_INVITE);
    });
  });

  describe('confirmedInvite', () => {
    it('sets call state', () => {
      const event = {};
      const action = confirmedInvite(event);

      const { state } = reducer(initialState, action);

      expect(state).to.eql(CONFIRMED_INVITE);
    });
  });

  describe('callConnected', () => {
    it('sets call state', () => {
      const event = {};
      const action = callConnected(event);

      const { state } = reducer(initialState, action);

      expect(state).to.eql(CONNECTED);
    });
  });

  describe('mutePressed', () => {
    it('toggles call mute state', () => {
      const action = mutePressed();

      let newState = reducer(initialState, action);
      expect(newState.isMuted).to.be.true;

      newState = reducer(newState, action);
      expect(newState.isMuted).to.be.false;
    });
  });

  describe('toggleKeypad', () => {
    it('toggles keypad visibility state', () => {
      const action = toggleKeypad();

      let newState = reducer(initialState, action);
      expect(newState.isKeypadVisible).to.be.true;

      newState = reducer(newState, action);
      expect(newState.isKeypadVisible).to.be.false;
    });
  });

  describe('keypadButtonPressed', () => {
    it('appends key to keypadPresses', () => {
      const state = {
        ...initialState,
        state: CONNECTED,
      };
      const key = '1';
      const action = keypadButtonPressed(key);

      let newState = reducer(state, action);
      expect(newState.keypadPresses).to.eql([key]);

      newState = reducer(newState, action);
      expect(newState.keypadPresses).to.eql([key, key]);
    });

    it('ignores the action when the call is not active', () => {
      const state = {
        ...initialState,
        state: INITIATED,
      };
      const key = '1';
      const action = keypadButtonPressed(key);

      const { keypadPresses } = reducer(state, action);
      expect(keypadPresses).to.be.empty;
    });
  });

  describe('audioInputDeviceChanged', () => {
    it('sets the audio input device id', () => {
      const deviceId = '0';
      const action = audioInputDeviceChanged(deviceId);

      const { inputDeviceId } = reducer(initialState, action);

      expect(inputDeviceId).to.eql(deviceId);
    });
  });

  describe('audioOutputDeviceChange', () => {
    it('sets the audio output device id', () => {
      const deviceId = '0';
      const action = audioOutputDeviceChanged(deviceId);

      const { outputDeviceId } = reducer(initialState, action);

      expect(outputDeviceId).to.eql(deviceId);
    });
  });

  describe('callEnded', () => {
    it('sets call state', () => {
      const event = {};
      const action = callEnded(event);

      const { state } = reducer(initialState, action);

      expect(state).to.eql(ENDED);
    });

    it('resets remote stream', () => {
      const previousState = {
        ...initialState,
        remoteStream: { id: '123' },
      };
      const event = {};
      const action = callEnded(event);

      const { remoteStream } = reducer(previousState, action);

      expect(remoteStream).to.be.null;
    });
  });

  describe('callFailed', () => {
    it('sets call state', () => {
      const event = {};
      const action = callFailed(event);

      const { state } = reducer(initialState, action);

      expect(state).to.eql(FAILED);
    });

    it('sets call error state', () => {
      const event = { cause: jssip.C.causes.USER_DENIED_MEDIA_ACCESS };
      const action = callFailed(event);

      const { errorState } = reducer(initialState, action);

      expect(errorState).to.eql(event.cause);
    });
  });
});
