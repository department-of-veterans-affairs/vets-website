import React from 'react';

export default function CallHRC({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} us at{' '}
      <a href="tel:18555747286">855-574-7286</a>.<br />
      If you have hearing loss, call TTY: 711.
    </span>
  );
}
