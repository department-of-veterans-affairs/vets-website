import React from 'react';

export default function CallVBACenter({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} VA Benefits and Services at{' '}
      <a href="tel:18008271000">800-827-1000</a>.<br /> If you have hearing
      loss, call{' '}
      <a href="tel:711" aria-label="TTY. 7 1 1.">
        TTY: 711
      </a>
      .
    </span>
  );
}
