import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export default function CallVBACenter({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} VA Benefits and Services at{' '}
      <a href="tel:18008271000">800-827-1000</a>.<br /> If you have hearing{' '}
      loss, call TTY:{' '}
      <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
    </span>
  );
}
