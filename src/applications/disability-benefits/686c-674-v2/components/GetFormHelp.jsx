import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <p className="help-talk">
    Need help filling out the form or have questions about eligibility? Call VA
    Benefits and Services at <va-telephone contact={CONTACTS.VA_BENEFITS} />.
    <br />
    <br />
    If you have hearing loss, call TTY: <va-telephone contact={CONTACTS[711]} />
    .
  </p>
);

export default GetFormHelp;
