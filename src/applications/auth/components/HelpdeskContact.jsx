import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function Helpdesk({ children }) {
  const startSentence = !children?.length;

  return (
    <p>
      {children}
      {startSentence ? 'Please' : ' please'} call our MyVA411 main information
      line for help at <va-telephone contact={CONTACTS.HELP_DESK} /> (TTY:
      <va-telephone contact={CONTACTS['711']} />
      ).
    </p>
  );
}
