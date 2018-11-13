import React from 'react';
import isBrandConsolidationEnabled from '../feature-flag';

export default function CallNCACenter({ children, startSentence }) {
  if (!isBrandConsolidationEnabled()) {
    return <span>{children}</span>;
  }

  return (
    <span>
      {startSentence ? 'Call' : 'call'} the National Cemetery Scheduling Office:{' '}
      <a href="tel:18005351117">1-800-535-1117</a>.<br /> If you have hearing
      loss, call TTY: 711.
    </span>
  );
}
