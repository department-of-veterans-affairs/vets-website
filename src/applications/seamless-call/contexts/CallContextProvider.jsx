import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  acceptedInvite,
  callConnected,
  callEnded,
  callFailed,
  callInitiated,
  confirmedInvite,
  gotRemoteTrack,
  ringing,
  sendingInvite,
  sipTransportConnected,
  sipTransportConnecting,
  sipTransportDisconnected,
} from '../actions';
import { INITIATED } from '../constants';
import { isActive } from '../utils/CallState';
import jssip from '../utils/JsSipWrapper';
import { CallContext } from './CallContext';

jssip.debug.enable('JsSIP:*');

const CallContextProvider = ({
  sipServer,
  iceServerUrls,
  callerSipUri,
  callerSipPassword,
  children,
}) => {
  const {
    state,
    target,
    extraHeaders,
    isMuted,
    keypadPresses,
    inputDeviceId,
    outputDeviceId,
  } = useSelector(({ call: c }) => c);
  const dispatch = useDispatch();
  const [rtcSession, setRtcSession] = useState(null);

  const uaRef = useRef(null);
  if (uaRef.current === null) {
    uaRef.current = new jssip.UA({
      sockets: [new jssip.WebSocketInterface(sipServer)],
      uri: callerSipUri,
      password: callerSipPassword,
      register: false,
      /* eslint-disable camelcase */
      session_timers: false,
      user_agent: 'AudioCodes Click-to-Call',
      /* eslint-enable camelcase */
    });
    uaRef.current.on('connecting', event =>
      dispatch(sipTransportConnecting(event)),
    );
    uaRef.current.on('connected', event =>
      dispatch(sipTransportConnected(event)),
    );
    uaRef.current.on('disconnected', event =>
      dispatch(sipTransportDisconnected(event)),
    );
  }
  const ua = uaRef.current;

  const connect = useCallback(() => ua.start(), [ua]);

  const disconnect = useCallback(() => ua.stop(), [ua]);

  const call = useCallback(
    (newTarget, newExtraHeaders) =>
      dispatch(callInitiated(newTarget, newExtraHeaders)),
    [dispatch],
  );

  useEffect(
    () => {
      if (state === INITIATED && target && inputDeviceId && outputDeviceId) {
        const r = ua.call(target, {
          mediaConstraints: {
            audio: {
              deviceId: [inputDeviceId, outputDeviceId],
            },
          },
          pcConfig: {
            iceServers: [
              {
                urls: iceServerUrls,
              },
            ],
          },
          rtcOfferConstraints: {
            offerToReceiveAudio: true,
            offerToReceiveVideo: false,
          },
          extraHeaders,
          eventHandlers: {
            peerconnection: ({ peerconnection }) => {
              peerconnection.addEventListener('connectionstatechange', () => {
                if (peerconnection.connectionState === 'connected') {
                  dispatch(callConnected());
                }
              });

              peerconnection.addEventListener('track', event =>
                dispatch(gotRemoteTrack(event)),
              );
            },
            icecandidate: ({ candidate, ready }) => {
              if (candidate.type === 'srflx') {
                ready();
              }
            },
            sending: event => dispatch(sendingInvite(event)),
            progress: event => dispatch(ringing(event)),
            accepted: event => dispatch(acceptedInvite(event)),
            confirmed: event => dispatch(confirmedInvite(event)),
            ended: event => dispatch(callEnded(event)),
            failed: event => dispatch(callFailed(event)),
          },
        });
        setRtcSession(r);
      }
    },
    [
      state,
      target,
      extraHeaders,
      inputDeviceId,
      outputDeviceId,
      ua,
      iceServerUrls,
      dispatch,
    ],
  );

  const hangUp = useCallback(() => rtcSession?.terminate(), [rtcSession]);

  useEffect(
    () => {
      if (isActive(state) && isMuted !== null) {
        if (isMuted) {
          rtcSession.mute();
        } else {
          rtcSession.unmute();
        }
      }
    },
    [state, isMuted, rtcSession],
  );

  useEffect(
    () => {
      if (isActive(state) && keypadPresses.length > 0) {
        const rtpSenders = rtcSession.connection.getSenders();
        const dtmfSender = rtpSenders[0].dtmf;
        dtmfSender.insertDTMF(keypadPresses[keypadPresses.length - 1], 1000);
      }
    },
    [state, rtcSession, keypadPresses],
  );

  return (
    <CallContext.Provider
      value={{
        connect,
        disconnect,
        call,
        hangUp,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

CallContextProvider.propTypes = {
  callerSipPassword: PropTypes.string.isRequired,
  callerSipUri: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  iceServerUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  sipServer: PropTypes.string.isRequired,
};

export default CallContextProvider;
