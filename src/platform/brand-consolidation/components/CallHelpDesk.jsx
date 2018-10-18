import React from 'react';
import isBrandConsolidationEnabled from '../feature-flag';

export default function CallHelpDesk({ children, startSentence }) {
  if (!isBrandConsolidationEnabled()) {
    return children;
  }

  return (
    <span>
      {startSentence ? 'Call' : 'call'} MyVA311 for help: 1-844-698-2311. If you
      have hearing loss, call TTY: 711.
    </span>
  );
}
