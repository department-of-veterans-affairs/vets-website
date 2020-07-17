import React from 'react';

export default function CallHRC({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} us at{' '}
      <a href="tel:18555747286">855-574-7286</a>.<br />
      If you have hearing loss, call{' '}
      <a href="tel:711" aria-label="TTY. 7 1 1.">
        TTY: 711
      </a>
      .
    </span>
  );
}
