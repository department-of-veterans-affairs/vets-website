import React from 'react';

import { act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DEFAULT_AUDIO_DEVICE_ID,
  SIP_TRANSPORT_CONNECTED,
} from '../../constants';
import CallContextProvider from '../../contexts/CallContextProvider';
import jssip from '../../utils/JsSipWrapper';
import {
  createHostIceCandidate,
  createIceCandidateEvent,
  createJsSipMocks,
  createPeerConnectionEvent,
  createPeerConnectionMock,
  createRtcSessionFailedEvent,
  createSrflxIceCandidate,
  createTrackEvent,
  createUaDisconnectedErrorEvent,
} from '../test-helpers/CallTestFactories';
import { renderWithReduxProvider } from './test-helpers/CallContextProviderTestHelpers';
import TestCallContextConsumer from './test-helpers/TestCallContextConsumer';
import {
  getCallButton,
  getHangUpButton,
  getIsMuted,
  getKeypadPresses,
  getMuteButton,
  getPress1Button,
  getPress2Button,
  getRemoteStreamId,
  getSipTransportDisconnectedStatusCodeText,
  getToggleKeypadButton,
  waitForAcceptedInviteStateText,
  waitForCallInitiatedStateText,
  waitForConfirmedInviteStateText,
  waitForConnectedStateText,
  waitForEndedStateText,
  waitForRingingStateText,
  waitForSendingInviteStateText,
  waitForSipTransportConnectedStateText,
  waitForSipTransportConnectingStateText,
  waitForSipTransportDisconnectedStateText,
  waitForUserDeniedMediaAccessErrorStateText,
} from './test-helpers/TestCallContextConsumerTestHelpers';

describe('CallContextProvider', () => {
  const setupMocks = () => {
    const mockWebSocketInterfaceInstance = sinon.stub();
    const mockWebSocketInterface = sinon.fake.returns(
      mockWebSocketInterfaceInstance,
    );
    sinon.replace(jssip, 'WebSocketInterface', mockWebSocketInterface);

    const { mockUaInstance, mockRtcSession } = createJsSipMocks();
    const mockUa = sinon.fake.returns(mockUaInstance);
    sinon.replace(jssip, 'UA', mockUa);

    const { mockPeerConnection, mockDataChannel } = createPeerConnectionMock();

    return {
      mockUa,
      mockUaInstance,
      mockRtcSession,
      mockWebSocketInterface,
      mockWebSocketInterfaceInstance,
      mockPeerConnection,
      mockDataChannel,
    };
  };

  const defaultProps = {
    sipServer: 'ws://localhost:5062',
    callerSipUri: 'sip:alice@sip.local',
    callerSipPassword: '12345',
    iceServerUrls: ['stun:stun.l.google.com:19302'],
  };

  const defaultConsumerProps = {
    calleeSipUri: 'sip:bob@sip.local',
    calleeName: 'Bob',
    extraHeaders: ['X-Extra-Header: value'],
  };

  const doRender = ({ state = {} } = {}) => ({
    ...setupMocks(),
    ...renderWithReduxProvider(
      <CallContextProvider {...defaultProps}>
        <TestCallContextConsumer {...defaultConsumerProps} />
      </CallContextProvider>,
      { state },
    ),
  });

  afterEach(sinon.restore);

  it('starts the user agent on connect', async () => {
    const { mockUaInstance } = doRender();

    await waitFor(() => sinon.assert.calledOnce(mockUaInstance.start));
  });

  it('stops the user agent on disconnect', async () => {
    const { view, mockUaInstance } = doRender();

    view.unmount();

    await waitFor(() => sinon.assert.calledOnce(mockUaInstance.stop));
  });

  it('updates the SIP transport state based on JsSIP user agent events', async () => {
    const {
      mockWebSocketInterface,
      mockWebSocketInterfaceInstance,
      mockUa,
      mockUaInstance,
      view,
    } = doRender();

    sinon.assert.calledWithNew(mockWebSocketInterface);
    sinon.assert.calledOnceWithExactly(
      mockWebSocketInterface,
      defaultProps.sipServer,
    );
    sinon.assert.calledWithNew(mockUa);
    sinon.assert.calledOnceWithExactly(mockUa, {
      sockets: [mockWebSocketInterfaceInstance],
      uri: defaultProps.callerSipUri,
      password: defaultProps.callerSipPassword,
      register: false,
      /* eslint-disable camelcase */
      session_timers: false,
      user_agent: 'AudioCodes Click-to-Call',
      /* eslint-enable camelcase */
    });

    act(() => mockUaInstance.emitConnectingEvent());
    await waitForSipTransportConnectingStateText(view);

    act(() => mockUaInstance.emitConnectedEvent());
    await waitForSipTransportConnectedStateText(view);

    const uaDisconnectedErrorEvent = createUaDisconnectedErrorEvent();
    act(() => mockUaInstance.emitDisconnectedEvent(uaDisconnectedErrorEvent));
    await waitForSipTransportDisconnectedStateText(view);
    expect(getSipTransportDisconnectedStatusCodeText(view)).to.have.text(
      uaDisconnectedErrorEvent.code.toString(),
    );
  });

  it('updates call state based on RtcSession events', async () => {
    const {
      view,
      mockUaInstance,
      mockRtcSession,
      mockPeerConnection,
    } = doRender({
      state: {
        sipTransportState: SIP_TRANSPORT_CONNECTED,
      },
    });

    userEvent.click(getCallButton(view));
    await waitForCallInitiatedStateText(view);

    sinon.assert.calledWith(
      mockUaInstance.call,
      defaultConsumerProps.calleeSipUri,
      {
        mediaConstraints: {
          audio: {
            deviceId: [DEFAULT_AUDIO_DEVICE_ID, DEFAULT_AUDIO_DEVICE_ID],
          },
        },
        pcConfig: {
          iceServers: [
            {
              urls: defaultProps.iceServerUrls,
            },
          ],
        },
        rtcOfferConstraints: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: false,
        },
        extraHeaders: defaultConsumerProps.extraHeaders,
        eventHandlers: {
          peerconnection: sinon.match.func,
          icecandidate: sinon.match.func,
          sending: sinon.match.func,
          progress: sinon.match.func,
          accepted: sinon.match.func,
          confirmed: sinon.match.func,
          ended: sinon.match.func,
          failed: sinon.match.func,
        },
      },
    );

    const hostIceCandidate = createHostIceCandidate();
    const hostIceCandidateEvent = createIceCandidateEvent({
      candidate: hostIceCandidate,
    });
    act(() => mockRtcSession.emitIceCandidateEvent(hostIceCandidateEvent));
    sinon.assert.notCalled(hostIceCandidateEvent.ready);

    const srflxIceCandidate = createSrflxIceCandidate();
    const iceCandidateEvent = createIceCandidateEvent({
      candidate: srflxIceCandidate,
    });
    act(() => mockRtcSession.emitIceCandidateEvent(iceCandidateEvent));
    sinon.assert.calledOnce(iceCandidateEvent.ready);

    act(() => mockRtcSession.emitSendingEvent());
    await waitForSendingInviteStateText(view);

    act(() => mockRtcSession.emitProgressEvent());
    await waitForRingingStateText(view);

    act(() => mockRtcSession.emitAcceptedEvent());
    await waitForAcceptedInviteStateText(view);

    act(() => mockRtcSession.emitConfirmedEvent());
    await waitForConfirmedInviteStateText(view);

    act(() =>
      mockRtcSession.emitPeerConnectionEvent(
        createPeerConnectionEvent({
          peerconnection: mockPeerConnection,
        }),
      ),
    );
    act(() => mockPeerConnection.emitConnectionStateChangeEvent());
    await waitForConnectedStateText(view);

    userEvent.click(getHangUpButton(view));
    sinon.assert.called(mockRtcSession.terminate);
    act(() => mockRtcSession.emitEndedEvent());
    await waitForEndedStateText(view);
  });

  it('sets the remote audio stream from the peer connection track event', () => {
    const { view, mockRtcSession, mockPeerConnection } = doRender();
    expect(getRemoteStreamId(view)).to.have.text('');

    userEvent.click(getCallButton(view));
    mockRtcSession.emitPeerConnectionEvent(
      createPeerConnectionEvent({
        peerconnection: mockPeerConnection,
      }),
    );
    act(() =>
      mockPeerConnection.emitTrackEvent(
        createTrackEvent({
          streams: [{ id: '123' }],
        }),
      ),
    );
    expect(getRemoteStreamId(view)).to.have.text('123');

    act(() => mockRtcSession.emitEndedEvent());
    expect(getRemoteStreamId(view)).to.have.text('');
  });

  it('updates call state based on RtcSession failure events', async () => {
    const { view, mockRtcSession } = doRender({
      state: {
        sipTransportState: SIP_TRANSPORT_CONNECTED,
      },
    });

    userEvent.click(getCallButton(view));

    act(() =>
      mockRtcSession.emitFailedEvent(
        createRtcSessionFailedEvent({
          cause: jssip.C.causes.USER_DENIED_MEDIA_ACCESS,
        }),
      ),
    );
    await waitForUserDeniedMediaAccessErrorStateText(view);
  });

  describe('when the call is active', () => {
    it('mutes/unmutes the current RTCSession when mute is clicked', () => {
      const { view, mockRtcSession, mockPeerConnection } = doRender({
        state: {
          sipTransportState: SIP_TRANSPORT_CONNECTED,
        },
      });

      userEvent.click(getCallButton(view));
      mockRtcSession.emitPeerConnectionEvent(
        createPeerConnectionEvent({
          peerconnection: mockPeerConnection,
        }),
      );
      act(() => mockPeerConnection.emitConnectionStateChangeEvent());
      sinon.assert.notCalled(mockRtcSession.unmute);

      userEvent.click(getMuteButton(view));
      sinon.assert.calledOnce(mockRtcSession.mute);
      expect(getIsMuted(view)).to.have.text('true');

      userEvent.click(getMuteButton(view));
      sinon.assert.calledOnce(mockRtcSession.unmute);
      expect(getIsMuted(view)).to.have.text('false');
    });

    it('sends keypad presses as DTMF when a keypad button is clicked', () => {
      const { view, mockRtcSession, mockPeerConnection } = doRender({
        state: {
          sipTransportState: SIP_TRANSPORT_CONNECTED,
        },
      });

      userEvent.click(getCallButton(view));
      mockRtcSession.emitPeerConnectionEvent(
        createPeerConnectionEvent({
          peerconnection: mockPeerConnection,
        }),
      );
      act(() => mockPeerConnection.emitConnectionStateChangeEvent());

      userEvent.click(getToggleKeypadButton(view));
      userEvent.click(getPress1Button(view));
      expect(getKeypadPresses(view)).to.have.text('1');
      const dtmfSender = mockRtcSession.connection.getSenders()[0].dtmf;
      sinon.assert.calledWith(dtmfSender.insertDTMF, '1', 1000);

      userEvent.click(getPress2Button(view));
      expect(getKeypadPresses(view)).to.have.text('1,2');
      sinon.assert.calledWith(dtmfSender.insertDTMF, '2', 1000);
    });
  });

  describe('when the call is not active', () => {
    it('ignores mute button clicks', () => {
      const { view, mockRtcSession } = doRender({
        state: {
          sipTransportState: SIP_TRANSPORT_CONNECTED,
        },
      });

      userEvent.click(getCallButton(view));

      userEvent.click(getMuteButton(view));
      sinon.assert.notCalled(mockRtcSession.mute);
    });

    it('ignores keypad button clicks', () => {
      const { view, mockRtcSession } = doRender({
        state: {
          sipTransportState: SIP_TRANSPORT_CONNECTED,
        },
      });

      userEvent.click(getCallButton(view));

      userEvent.click(getPress1Button(view));
      sinon.assert.notCalled(mockRtcSession.sendDTMF);
    });
  });
});
