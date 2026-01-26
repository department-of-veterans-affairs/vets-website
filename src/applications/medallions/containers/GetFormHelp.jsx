import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        <b>If you have questions about burial benefits, </b>
        call Memorial application assistance at{' '}
        <va-telephone contact="8006976947" /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 5:00 p.m. ET.
      </p>
      <p className="help-talk">
        <b>If you need help filling out your form, </b>
        contact a local Veterans Service Organization (VSO).
      </p>
      <p>
        <a href="/get-help-from-accredited-representative/find-rep/">
          Find a local Veterans Service Organization
        </a>
      </p>
    </div>
  );
}
