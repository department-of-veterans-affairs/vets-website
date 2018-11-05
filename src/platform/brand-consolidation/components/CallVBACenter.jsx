import React from 'react';
import isBrandConsolidationEnabled from '../feature-flag';

export default function CallVBACenter({ children, startSentence }) {
  if (!isBrandConsolidationEnabled()) {
    return <span>{children}</span>;
  }

  return (
    <span>
      {startSentence ? 'Call' : 'call'} the VBA Call Center for help:{' '}
      <a href="tel:18008271000">1-800-827-1000</a>. If you have hearing loss,
      call TTY: 711.
    </span>
  );
}
