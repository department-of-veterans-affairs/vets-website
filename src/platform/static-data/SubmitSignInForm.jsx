// Node modules.
import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export default function SubmitSignInForm({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} our MyVA411 main information line for
      help at <Telephone contact={CONTACTS.HELP_DESK} />
      &nbsp;(TTY:{' '}
      <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
      ).
    </span>
  );
}
