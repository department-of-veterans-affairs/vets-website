import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export default function CallHRC({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} us at{' '}
      <Telephone contact={CONTACTS.HELP_DESK} />.<br />
      If you have hearing loss, call TTY:{' '}
      <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
    </span>
  );
}
