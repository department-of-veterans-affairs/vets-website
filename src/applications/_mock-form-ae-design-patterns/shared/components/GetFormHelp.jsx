import { CONTACTS } from '@department-of-veterans-affairs/component-library';
import React from 'react';

export const GetFormHelp = () => {
  return (
    <>
      <p>
        If you have questions or need help filling out this form, please call us
        at <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
        through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
      <p>
        If you have hearing loss, call{' '}
        <va-telephone contact={CONTACTS['711']} tty />.
      </p>
    </>
  );
};
