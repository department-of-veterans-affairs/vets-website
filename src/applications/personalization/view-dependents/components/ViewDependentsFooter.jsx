import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const ViewDependentsFooter = () => (
  <div>
    <h2 className="vads-u-font-size--h3 vads-u-padding-bottom--1 vads-u-border-bottom--3px vads-u-border-color--primary">
      What if I have questions?
    </h2>
    <p>
      You can call us at
      <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday through
      Friday, 8:00 a.m. to 9:00 p.m. ET.
    </p>
  </div>
);

export default ViewDependentsFooter;
