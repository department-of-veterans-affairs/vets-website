import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        If you have questions or need help filling out this form, call our
        MyVA411 main information line at{' '}
        <va-telephone contact={CONTACTS.HELP_DESK} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ).
      </p>
    </div>
  );
}

export default GetFormHelp;
