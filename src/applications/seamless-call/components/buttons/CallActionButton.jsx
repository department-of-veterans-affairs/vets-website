import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useCallContext from '../../contexts/useCallContext';
import { isActive, isInitializing } from '../../utils/CallState';
import CallButton from './CallButton';
import HangUpButton from './HangUpButton';

const CallActionButton = ({ calleeSipUri, extraHeaders }) => {
  const { call, hangUp } = useCallContext();
  const { state } = useSelector(({ call: c }) => c);

  const handleCallButtonClicked = useCallback(
    () => call(calleeSipUri, extraHeaders),
    [call, calleeSipUri, extraHeaders],
  );

  const handleHangUpButtonClicked = useCallback(hangUp, [hangUp]);

  const [Button, onClick] = useMemo(
    () =>
      isInitializing(state) || isActive(state)
        ? [HangUpButton, handleHangUpButtonClicked]
        : [CallButton, handleCallButtonClicked],
    [state, handleCallButtonClicked, handleHangUpButtonClicked],
  );

  return <Button onClick={onClick} />;
};

CallActionButton.propTypes = {
  calleeSipUri: PropTypes.string.isRequired,
  extraHeaders: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CallActionButton;
