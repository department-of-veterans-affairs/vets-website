import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export default function CallMyVA311({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} us at{' '}
      <a href="tel:18446982311">844-698-2311</a>.<br />
      If you have hearing loss, call TTY:{' '}
      <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
    </span>
  );
}
