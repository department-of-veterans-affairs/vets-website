import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

/**
 * Render form help footer
 * @returns {React.ReactElement} get form help footer
 */
const GetFormHelp = () => (
  <>
    <p className="help-talk">
      For help filling out this form, or if the form isn’t working right, please
      call VA Benefits and Services at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday through
      Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing loss, call{' '}
      <va-telephone tty contact={CONTACTS['711']} />.
    </p>
  </>
);

export default GetFormHelp;
