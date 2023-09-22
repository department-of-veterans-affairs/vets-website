import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <p className="help-talk">
    If you have questions or need help filling out this form, call our MyVA411
    main information line at <va-telephone contact={CONTACTS.VA_411} /> (
    <va-telephone contact={CONTACTS['711']} tty />
    ).
  </p>
);

export default GetFormHelp;
