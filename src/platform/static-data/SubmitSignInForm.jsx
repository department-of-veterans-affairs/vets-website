import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function SubmitSignInForm({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} our MyVA411 main information line for
      help at <va-telephone contact={CONTACTS.HELP_DESK} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ).
    </span>
  );
}
