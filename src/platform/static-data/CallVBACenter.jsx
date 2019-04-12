import React from 'react';

export default function CallVBACenter({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} VA Benefits and Services at{' '}
      <a href="tel:18008271000">800-827-1000</a>.<br /> If you have hearing
      loss, call TTY: 711.
    </span>
  );
}
