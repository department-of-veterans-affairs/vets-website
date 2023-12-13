import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function IdentityPhone({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} us at{' '}
      <va-telephone contact={CONTACTS.VA_411} /> and select 0 (
      <va-telephone contact={CONTACTS[711]} tty />
      ).
    </span>
  );
}
