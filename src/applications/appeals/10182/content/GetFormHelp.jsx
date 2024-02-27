import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <>
    <p className="help-talk">
      If you have questions please call us at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday through
      Friday, 8:00 a.m. to 9:00 p.m ET.{' '}
    </p>
    <p className="u-vads-margin-bottom--0">
      If you have hearing loss, call TTY:{' '}
      <va-telephone contact={CONTACTS[711]} />.
    </p>
  </>
);

export default GetFormHelp;
