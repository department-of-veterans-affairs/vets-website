import React, { useState, useCallback } from 'react';
import propTypes from 'prop-types';
import { useStorage } from '../../useStorage';

export default function TestComponent({
  window,
  app,
  token,
  travelPay,
  completeTimestamp,
}) {
  const {
    clearCurrentStorage,
    getCurrentToken,
    setCurrentToken,
    getCompleteTimestamp,
    setCompleteTimestamp,
  } = useStorage(app);
  const { setTravelPaySent, getTravelPaySent } = useStorage(app, true);

  const [fromSession, setFromSession] = useState();
  const [fromLocal, setFromLocal] = useState();
  return (
    <div>
      <h1>Test component for the useStorage hook</h1>
      <va-button
        uswds
        onClick={useCallback(() => clearCurrentStorage(window), [
          clearCurrentStorage,
          window,
        ])}
        text="Clear"
        data-testid="clear-button"
      />
      <va-button
        uswds
        onClick={useCallback(
          () => {
            setFromSession(getCurrentToken(window));
          },
          [setFromSession, getCurrentToken, window],
        )}
        text="get"
        data-testid="get-button"
      />
      <va-button
        uswds
        onClick={useCallback(
          () => {
            setCurrentToken(window, token);
          },
          [setCurrentToken, window, token],
        )}
        text="set"
        data-testid="set-button"
      />
      <div data-testid="from-session">
        {fromSession && JSON.stringify(fromSession)}
      </div>
      <va-button
        uswds
        onClick={useCallback(
          () => {
            setFromLocal(getTravelPaySent(window));
          },
          [setFromLocal, getTravelPaySent, window],
        )}
        text="get local"
        data-testid="get-local-button"
      />
      <va-button
        uswds
        onClick={useCallback(
          () => {
            setTravelPaySent(window, travelPay);
          },
          [setTravelPaySent, window, travelPay],
        )}
        text="set local"
        data-testid="set-local-button"
      />
      <div data-testid="from-local">
        {fromLocal && JSON.stringify(fromLocal)}
      </div>
      <va-button
        uswds
        onClick={useCallback(
          () => {
            setCompleteTimestamp(window, completeTimestamp);
          },
          [setCompleteTimestamp, window, completeTimestamp],
        )}
        text="set complete timestamp"
        data-testid="set-complete-timestamp-button"
      />
      <va-button
        uswds
        onClick={useCallback(
          () => {
            setFromSession(getCompleteTimestamp(window));
          },
          [setFromSession, getCompleteTimestamp, window],
        )}
        text="Get Complete Timestamp"
        data-testid="get-complete-timestamp-button"
      />
    </div>
  );
}

TestComponent.propTypes = {
  app: propTypes.string,
  completeTimestamp: propTypes.string,
  token: propTypes.string,
  travelPay: propTypes.object,
  window: propTypes.object,
};
