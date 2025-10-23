import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function CallMyVA311({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} us at{' '}
      <va-telephone contact={CONTACTS.VA_311} />.<br />
      If you have hearing loss, call{' '}
      <va-telephone contact={CONTACTS['711']} tty />.
    </span>
  );
}
