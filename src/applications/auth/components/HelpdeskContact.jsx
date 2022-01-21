import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export default function Helpdesk({ children }) {
  const startSentence = !children?.length;

  return (
    <p>
      {children}
      {startSentence ? 'Please' : ' please'} call our MyVA411 main information
      line for help at <Telephone contact={CONTACTS.HELP_DESK} /> (TTY:{' '}
      <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
      ).
    </p>
  );
}
