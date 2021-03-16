import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export default function CallNCACenter({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} the National Cemetery Scheduling Office
      at <a href="tel:18005351117">800-535-1117</a>.<br /> If you have hearing{' '}
      loss, call TTY:{' '}
      <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
    </span>
  );
}
