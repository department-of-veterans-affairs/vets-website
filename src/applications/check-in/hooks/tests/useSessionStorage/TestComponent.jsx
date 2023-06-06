import React, { useState, useCallback } from 'react';
import propTypes from 'prop-types';
import { useSessionStorage } from '../../useSessionStorage';

export default function TestComponent({ window, isPreCheckIn, token }) {
  const {
    clearCurrentSession,
    getCurrentToken,
    setCurrentToken,
  } = useSessionStorage(isPreCheckIn);
  const [fromSession, setFromSession] = useState();
  return (
    <div>
      <h1>Test component for the useSessionStorage hook</h1>

      <button
        onClick={useCallback(
          () => {
            clearCurrentSession(window);
          },
          [clearCurrentSession, window],
        )}
        data-testid="clear-button"
        type="button"
      >
        clear
      </button>
      <button
        onClick={useCallback(
          () => {
            setFromSession(getCurrentToken(window));
          },
          [setFromSession, getCurrentToken, window],
        )}
        data-testid="get-button"
        type="button"
      >
        get
      </button>
      <button
        onClick={useCallback(
          () => {
            setCurrentToken(window, token);
          },
          [setCurrentToken, window, token],
        )}
        data-testid="set-button"
        type="button"
      >
        set
      </button>
      <div data-testid="from-session">
        {fromSession && JSON.stringify(fromSession)}
      </div>
    </div>
  );
}

TestComponent.propTypes = {
  isPreCheckIn: propTypes.bool,
  token: propTypes.string,
  window: propTypes.object,
};
