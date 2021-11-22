import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        If you have questions or need help filling out this form, call our
        MyVA411 main information line at{' '}
        <Telephone contact={CONTACTS.HELP_DESK} /> (TTY:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />
        ).
      </p>
    </div>
  );
}

export default GetFormHelp;
