import React, { useState, useCallback } from 'react';
import propTypes from 'prop-types';
import { useStorage } from '../../useStorage';

export default function TestComponent({ window, app, token, travelPay }) {
  const { clearCurrentStorage, getCurrentToken, setCurrentToken } = useStorage(
    app,
  );
  const { setTravelPaySent, getTravelPaySent } = useStorage(app, true);

  const [fromSession, setFromSession] = useState();
  const [fromLocal, setFromLocal] = useState();
  return (
    <div>
      <h1>Test component for the useStorage hook</h1>

      <button
        onClick={useCallback(
          () => {
            clearCurrentStorage(window);
          },
          [clearCurrentStorage, window],
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
      <button
        onClick={useCallback(
          () => {
            setFromLocal(getTravelPaySent(window));
          },
          [setFromLocal, getTravelPaySent, window],
        )}
        data-testid="get-local-button"
        type="button"
      >
        get local
      </button>
      <button
        onClick={useCallback(
          () => {
            setTravelPaySent(window, travelPay);
          },
          [setTravelPaySent, window, travelPay],
        )}
        data-testid="set-local-button"
        type="button"
      >
        set local
      </button>
      <div data-testid="from-local">
        {fromLocal && JSON.stringify(fromLocal)}
      </div>
    </div>
  );
}

TestComponent.propTypes = {
  app: propTypes.string,
  token: propTypes.string,
  travelPay: propTypes.object,
  window: propTypes.object,
};
