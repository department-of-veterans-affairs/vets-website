import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  keypadButtonPressed,
  mutePressed,
  toggleKeypad,
} from '../../../actions';
import useCallContext from '../../../contexts/useCallContext';

/* eslint @department-of-veterans-affairs/prefer-button-component: off */

const TestCallContextConsumer = ({ calleeSipUri, extraHeaders }) => {
  const { connect, disconnect, call, hangUp } = useCallContext();
  const {
    sipTransportState,
    sipTransportDisconnectedStatusCode,
    state,
    errorState,
    remoteStream,
    isMuted,
    isKeypadVisible,
    keypadPresses,
  } = useSelector(({ call: c }) => c);
  const dispatch = useDispatch();

  useEffect(
    () => {
      connect();

      return disconnect;
    },
    [connect, disconnect],
  );

  const handleCallButtonClicked = useCallback(
    () => call(calleeSipUri, extraHeaders),
    [call, calleeSipUri, extraHeaders],
  );
  const handleMuteButtonClicked = useCallback(() => dispatch(mutePressed()), [
    dispatch,
  ]);
  const handleToggleKeypadButtonClicked = useCallback(
    () => dispatch(toggleKeypad()),
    [dispatch],
  );
  const handleKeyPress = useCallback(
    key => dispatch(keypadButtonPressed(key)),
    [dispatch],
  );

  return (
    <>
      <p data-testid="sipTransportState">{sipTransportState}</p>
      <p data-testid="sipTransportDisconnectedStatusCode">
        {sipTransportDisconnectedStatusCode}
      </p>
      <p data-testid="callState">{state}</p>
      {errorState && <p data-testid="errorState">{errorState}</p>}
      <span data-testid="remoteStreamId">{remoteStream?.id}</span>
      <button type="button" onClick={handleCallButtonClicked}>
        Call
      </button>
      <button type="button" onClick={hangUp}>
        Hang Up
      </button>
      <button type="button" onClick={handleMuteButtonClicked}>
        Mute
      </button>
      <span data-testid="isMuted">{isMuted?.toString()}</span>
      <button type="button" onClick={handleToggleKeypadButtonClicked}>
        Toggle keypad
      </button>
      <span data-testid="isKeypadVisible">{isKeypadVisible.toString()}</span>
      <span data-testid="keypadPresses">{keypadPresses.toString()}</span>
      <button type="button" onClick={() => handleKeyPress('1')}>
        Press 1
      </button>
      <button type="button" onClick={() => handleKeyPress('2')}>
        Press 2
      </button>
    </>
  );
};

TestCallContextConsumer.propTypes = {
  calleeName: PropTypes.string.isRequired,
  calleeSipUri: PropTypes.string.isRequired,
  extraHeaders: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TestCallContextConsumer;
