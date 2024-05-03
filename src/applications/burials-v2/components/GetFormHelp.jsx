import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

function GetFormHelp() {
  return (
    <p className="help-talk">
      <strong>If you have trouble using this online form</strong>, call our
      MyVA411 main information line at{' '}
      <va-telephone contact={CONTACTS.HELP_DESK} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here 24/7.
    </p>
  );
}

export default GetFormHelp;
