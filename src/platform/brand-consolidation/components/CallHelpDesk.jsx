import React from 'react';
import isBrandConsolidationEnabled from '../feature-flag';

export default function CallHelpDesk({ children, startSentence }) {
  if (!isBrandConsolidationEnabled()) {
    return <span>{children}</span>;
  }

  return (
    <span>
      {startSentence ? 'Call' : 'call'} MyVA311 for help:{' '}
      <a href="tel:18446982311">1-844-698-2311</a>. If you have hearing loss,
      call TTY: 711.
    </span>
  );
}
