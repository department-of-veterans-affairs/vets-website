import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

/**
 * Render form help footer
 * @returns {React.ReactElement} get form help footer
 */
const GetFormHelp = () => (
  <>
    <p className="help-talk">
      <strong>If you have trouble using this online form</strong>, call us at{' '}
      <va-telephone contact={CONTACTS.HELP_DESK} /> (
      <va-telephone tty contact={CONTACTS['711']} />
      ). We’re here 24/7.
    </p>
    <p>
      <strong>
        If you need help gathering your information or filling out your form
      </strong>
      , contact a local Veterans Service Organization (VSO).
    </p>
    <va-link
      text="Find a local
        Veterans Service Organization"
      label="Find a local
        Veterans Service Organization"
      href="/get-help-from-accredited-representative"
    />
  </>
);

export default GetFormHelp;
