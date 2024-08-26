import sinon from 'sinon';
import {
  AUDIO_INPUT_DEVICE,
  AUDIO_OUTPUT_DEVICE,
  DEFAULT_AUDIO_DEVICE_ID,
} from '../../constants';
import jssip from '../../utils/JsSipWrapper';

const emit = (stub, eventName, data) =>
  stub
    .getCalls()
    .filter(call => call.args[0] === eventName)
    .forEach(call => call.args[1](data));

export const createTrackEvent = attributes => ({
  streams: [],
  ...attributes,
});

export const createPeerConnectionMock = () => {
  const addEventListenerStub = sinon.stub();
  const dtmfSender = {
    insertDTMF: sinon.stub(),
  };
  const rtpSender = {
    dtmf: dtmfSender,
  };
  const mockDataChannel = {
    onopen: sinon.stub(),
    send: sinon.stub(),
  };
  const mockPeerConnection = {
    addEventListener: addEventListenerStub,
    emit: (eventName, data) => emit(addEventListenerStub, eventName, data),
    emitConnectionStateChangeEvent: () =>
      mockPeerConnection.emit('connectionstatechange'),
    emitTrackEvent: (event = createTrackEvent()) =>
      mockPeerConnection.emit('track', event),
    getSenders: sinon.stub().returns([rtpSender]),
    createDataChannel: sinon.stub().returns(mockDataChannel),
    connectionState: 'connected',
  };
  return {
    mockPeerConnection,
    mockDataChannel,
  };
};

export const createPeerConnectionEvent = attributes => ({
  peerconnection: createPeerConnectionMock().mockPeerConnection,
  ...attributes,
});

export const createIceCandidate = attributes => ({
  type: 'host',
  ...attributes,
});

export const createHostIceCandidate = attributes =>
  createIceCandidate({
    type: 'host',
    ...attributes,
  });

export const createSrflxIceCandidate = attributes =>
  createIceCandidate({
    type: 'srflx',
    ...attributes,
  });

export const createIceCandidateEvent = attributes => ({
  candidate: createIceCandidate(),
  ready: sinon.stub(),
  ...attributes,
});

export const createJsSipMocks = () => {
  const mockRtcSessionOnStub = sinon.stub();
  let mockUaInstance = null;
  const { mockPeerConnection } = createPeerConnectionMock();
  const mockRtcSession = {
    on: mockRtcSessionOnStub,
    mute: sinon.stub(),
    unmute: sinon.stub(),
    sendDTMF: sinon.stub(),
    terminate: sinon.stub(),
    emit: (eventName, data) => {
      const { eventHandlers } = mockUaInstance.call.getCalls()[0].args[1];
      eventHandlers[eventName](data);
    },
    emitPeerConnectionEvent: (event = { peerconnection: mockPeerConnection }) =>
      mockRtcSession.emit('peerconnection', event),
    emitIceCandidateEvent: (event = createIceCandidateEvent()) =>
      mockRtcSession.emit('icecandidate', event),
    emitSendingEvent: (event = {}) => mockRtcSession.emit('sending', event),
    emitProgressEvent: (event = {}) => mockRtcSession.emit('progress', event),
    emitAcceptedEvent: (event = {}) => mockRtcSession.emit('accepted', event),
    emitConfirmedEvent: (event = {}) => mockRtcSession.emit('confirmed', event),
    emitEndedEvent: (event = {}) => mockRtcSession.emit('ended', event),
    emitFailedEvent: (event = {}) => mockRtcSession.emit('failed', event),
    connection: mockPeerConnection,
  };

  const mockUaInstanceOnStub = sinon.stub();
  mockUaInstance = {
    on: mockUaInstanceOnStub,
    start: sinon.stub(),
    stop: sinon.stub(),
    call: sinon.stub().returns(mockRtcSession),
    emit: (eventName, data) => emit(mockUaInstanceOnStub, eventName, data),
    emitConnectingEvent: (event = {}) =>
      mockUaInstance.emit('connecting', event),
    emitConnectedEvent: (event = {}) => mockUaInstance.emit('connected', event),
    emitDisconnectedEvent: (event = {}) =>
      mockUaInstance.emit('disconnected', event),
  };

  return { mockUaInstance, mockRtcSession };
};

export const createUaDisconnectedErrorEvent = attributes => ({
  error: true,
  code: 1,
  ...attributes,
});

export const createRtcSessionFailedEvent = attributes => ({
  cause: jssip.C.causes.CANCELED,
  ...attributes,
});

export const createDevice = ({
  deviceId = 'a1b2c3d4',
  kind = AUDIO_INPUT_DEVICE,
  label = 'Default - MacBook Pro Microphone (Built-in)',
}) => ({
  deviceId,
  kind,
  label,
});

const createAudioInputDevice = (deviceId, label) =>
  createDevice({
    deviceId,
    kind: AUDIO_INPUT_DEVICE,
    label,
  });

const createAudioOutputDevice = (deviceId, label) =>
  createDevice({
    deviceId,
    kind: AUDIO_OUTPUT_DEVICE,
    label,
  });

export const createTestDeviceList = () => [
  createAudioInputDevice(
    DEFAULT_AUDIO_DEVICE_ID,
    'Default - MacBook Pro Microphone (Built-in)',
  ),
  createAudioInputDevice('47d6158a', 'Headphone adapter (18d1:5034)'),
  createAudioOutputDevice(
    DEFAULT_AUDIO_DEVICE_ID,
    'Default - MacBook Pro Speakers (Built-in)',
  ),
  createAudioOutputDevice('a52b957a', 'Microsoft Teams Audio Device (Virtual)'),
];

export const defineNavigatorMediaDevices = (
  devices = createTestDeviceList(),
) => {
  sinon.define(navigator, 'mediaDevices', {
    getUserMedia: sinon.fake.resolves(),
    enumerateDevices: sinon.fake.resolves(devices),
  });
};

export const createCallContext = (attributes = {}) => ({
  connect: sinon.stub(),
  disconnect: sinon.stub(),
  call: sinon.stub(),
  hangUp: sinon.stub(),
  ...attributes,
});
