import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import {
  ACCEPTED_INVITE,
  CONFIRMED_INVITE,
  CONNECTED,
  ENDED,
  INITIATED,
  RINGING,
  SENDING_INVITE,
  SIP_TRANSPORT_CONNECTED,
  SIP_TRANSPORT_CONNECTING,
  SIP_TRANSPORT_DISCONNECTED,
} from '../../../constants';
import jssip from '../../../utils/JsSipWrapper';

export const getCallButton = view => view.getByRole('button', { name: 'Call' });

export const getMuteButton = view => view.getByRole('button', { name: 'Mute' });

export const getIsMuted = view => view.getByTestId('isMuted');

export const getHangUpButton = view =>
  view.getByRole('button', { name: 'Hang Up' });

export const getRemoteStreamId = view => view.getByTestId('remoteStreamId');

const waitForText = (view, testId, text) =>
  waitFor(() => expect(view.getByTestId(testId)).to.have.text(text));

const waitForSipTransportStateText = (view, state) =>
  waitForText(view, 'sipTransportState', state);

export const waitForSipTransportConnectingStateText = view =>
  waitForSipTransportStateText(view, SIP_TRANSPORT_CONNECTING);

export const waitForSipTransportConnectedStateText = view =>
  waitForSipTransportStateText(view, SIP_TRANSPORT_CONNECTED);

export const waitForSipTransportDisconnectedStateText = view =>
  waitForSipTransportStateText(view, SIP_TRANSPORT_DISCONNECTED);

export const getSipTransportDisconnectedStatusCodeText = view =>
  view.getByTestId('sipTransportDisconnectedStatusCode');

export const waitForCallStateText = (view, state) =>
  waitForText(view, 'callState', state);

export const waitForCallInitiatedStateText = view =>
  waitForCallStateText(view, INITIATED);

export const waitForSendingInviteStateText = view =>
  waitForCallStateText(view, SENDING_INVITE);

export const waitForRingingStateText = view =>
  waitForCallStateText(view, RINGING);

export const waitForAcceptedInviteStateText = view =>
  waitForCallStateText(view, ACCEPTED_INVITE);

export const waitForConfirmedInviteStateText = view =>
  waitForCallStateText(view, CONFIRMED_INVITE);

export const waitForConnectedStateText = view =>
  waitForCallStateText(view, CONNECTED);

export const waitForEndedStateText = view => waitForCallStateText(view, ENDED);

export const waitForUserDeniedMediaAccessErrorStateText = view =>
  waitFor(() =>
    expect(view.getByTestId('errorState')).to.have.text(
      jssip.C.causes.USER_DENIED_MEDIA_ACCESS,
    ),
  );

export const getPress1Button = view =>
  view.getByRole('button', { name: 'Press 1' });

export const getPress2Button = view =>
  view.getByRole('button', { name: 'Press 2' });

export const getKeypadVisibility = view => view.getByTestId('isKeypadVisible');

export const getToggleKeypadButton = view =>
  view.getByRole('button', { name: 'Toggle keypad' });

export const getKeypadPresses = view => view.getByTestId('keypadPresses');
