import React, { useState } from 'react';
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
        onClick={() => {
          clearCurrentSession(window);
        }}
        data-testid="clear-button"
      >
        clear
      </button>
      <button
        onClick={() => {
          setFromSession(getCurrentToken(window));
        }}
        data-testid="get-button"
      >
        get
      </button>
      <button
        onClick={() => {
          setCurrentToken(window, token);
        }}
        data-testid="set-button"
      >
        set
      </button>
      <div data-testid="from-session">
        {fromSession && JSON.stringify(fromSession)}
      </div>
    </div>
  );
}
