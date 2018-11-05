import React from 'react';
import isBrandConsolidationEnabled from '../feature-flag';

export default function CallEduCallCenter({ children, startSentence }) {
  if (!isBrandConsolidationEnabled()) {
    return <span>{children}</span>;
  }

  return (
    <span>
      {startSentence ? 'Call' : 'call'} the Education Call Center for help:{' '}
      <a href="tel:18884424551">1-888-442-4551</a>. If you have hearing loss,
      call TTY: 711.
    </span>
  );
}
