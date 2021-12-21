import React, { useState } from 'react';
import { useSessionStorage } from '../../useSessionStorage';

export default function TestComponent({ window, sessionNameSpace, token }) {
  const {
    SESSION_STORAGE_KEYS,
    clearCurrentSession,
    getSessionKey,
    setSessionKey,
  } = useSessionStorage(sessionNameSpace);
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
          setFromSession(
            getSessionKey(window, SESSION_STORAGE_KEYS.CURRENT_UUID),
          );
        }}
        data-testid="get-button"
      >
        get
      </button>
      <button
        onClick={() => {
          setSessionKey(window, SESSION_STORAGE_KEYS.CURRENT_UUID, { token });
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
