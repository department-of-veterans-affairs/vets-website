import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <div className="help-footer-container usa-width-three-fourths vads-u-padding-x--4 vads-u-padding-bottom--4">
    <h2 className="help-heading" style={{ margin: 0 }}>
      How to contact us if you have questions
    </h2>
    <p className="help-talk">
      You can call us at{' '}
      <va-telephone contact={CONTACTS.VA_411} extension={0} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here 24/7.
    </p>
  </div>
);

export default GetFormHelp;
