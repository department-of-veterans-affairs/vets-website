import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export default function CallHRC({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} us at{' '}
      <a href="tel:18555747286">855-574-7286</a>.<br />
      If you have hearing loss, call{' '}
      <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
    </span>
  );
}
