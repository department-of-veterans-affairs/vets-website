import React, { useState } from 'react';
import { useSessionToken } from '../../useSessionToken';

export default function TestComponent({ window, sessionNameSpace, token }) {
  const { getCurrentToken, setCurrentToken } = useSessionToken(
    sessionNameSpace,
  );
  const [fromSession, setFromSession] = useState();
  return (
    <div>
      <h1>Test component for the useSessionToken hook</h1>
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
