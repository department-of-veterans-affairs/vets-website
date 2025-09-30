import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <p className="help-talk">
    Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here
    Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing loss,
    call <va-telephone contact={CONTACTS[711]} tty />.
  </p>
);

export default GetFormHelp;
