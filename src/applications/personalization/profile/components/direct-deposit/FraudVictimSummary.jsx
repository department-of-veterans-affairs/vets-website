import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const FraudVictimSummary = () => (
  <div className="vads-u-margin-top--4">
    <va-summary-box uswds>
      <h3 className="vads-u-font-size--md" slot="headline">
        What if I think I’ve been the victim of bank fraud?
      </h3>
      <p className="text-balance">
        Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </va-summary-box>
  </div>
);
