import { CONTACTS } from '@department-of-veterans-affairs/component-library';
import React from 'react';

export const GetFormHelp = () => {
  return (
    <>
      <p>
        If you have questions or need help filling out this form, call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
};
