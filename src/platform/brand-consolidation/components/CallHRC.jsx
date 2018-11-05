import React from 'react';
import isBrandConsolidationEnabled from '../feature-flag';

export default function CallHRC({ children, startSentence }) {
  if (!isBrandConsolidationEnabled()) {
    return <span>{children}</span>;
  }

  return (
    <span>
      {startSentence ? 'Call' : 'call'} HRC for help:{' '}
      <a href="tel:18555747286">1-855-574-7286</a>. If you have hearing loss,
      call TTY: 711.
    </span>
  );
}
