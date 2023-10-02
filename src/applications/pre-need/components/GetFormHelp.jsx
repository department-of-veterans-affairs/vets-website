import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function GetFormHelp() {
  return (
    <div>
      <p className="help-talk">
        Call the National Cemetery Scheduling Office at{' '}
        <va-telephone contact={CONTACTS.NCA} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ), and select option 4. We’re here Monday through Friday, 8:00 a.m. to
        5:30 p.m. ET.
      </p>
      <p className="help-talk">
        For benefit-related questions, call VA Benefits and Services at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 7:30 p.m. ET.
      </p>
    </div>
  );
}
