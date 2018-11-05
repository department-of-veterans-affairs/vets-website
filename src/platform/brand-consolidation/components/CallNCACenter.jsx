import React from 'react';
import isBrandConsolidationEnabled from '../feature-flag';

export default function CallNCACenter({ children, startSentence }) {
  if (!isBrandConsolidationEnabled()) {
    return <span>{children}</span>;
  }

  return (
    <span>
      {startSentence ? 'Call' : 'call'} the NCA Call Center for help:{' '}
      <a href="tel:18005351117">1-800-535-1117</a>. If you have hearing loss,
      call TTY: 711.
    </span>
  );
}
