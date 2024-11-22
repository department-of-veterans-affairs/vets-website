import React from 'react';
import { useBroadcastChannel } from './useBroadcastChannel';

export const Broadcast = () => {
  const [message, sendMessage] = useBroadcastChannel(
    'mock-form-ae-design-patterns',
  );

  return (
    <>
      <p>{message}</p>
      <button onClick={() => sendMessage(`hello ${Date.now()}`)}>
        Send Message
      </button>
    </>
  );
};
