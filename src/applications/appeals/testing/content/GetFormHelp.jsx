import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <div className="help-footer-box">
    <h2 className="help-heading">Need help?</h2>
    <p className="help-talk">
      If you have questions or need help filling out this form, please call us
      at <va-telephone contact={CONTACTS.VA_BENEFITS} uswds />. We’re here
      Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
    </p>
    <p className="u-vads-margin-bottom--0">
      If you have hearing loss, call{' '}
      <va-telephone contact={CONTACTS['711']} tty />.
    </p>
  </div>
);

export default GetFormHelp;
