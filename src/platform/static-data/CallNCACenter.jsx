import React from 'react';

export default function CallNCACenter({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} the National Cemetery Scheduling Office
      at <a href="tel:18005351117">800-535-1117</a>.<br /> If you have hearing
      loss, call{' '}
      <a href="tel:711" aria-label="TTY. 7 1 1.">
        TTY: 711
      </a>
      .
    </span>
  );
}
