import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <div className="help-footer-box">
    <h2 className="help-heading">Need Help?</h2>
    <p className="help-talk">
      You can call us at <va-telephone contact={CONTACTS.VA_411} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here 24/7.
    </p>
  </div>
);

export default GetFormHelp;
