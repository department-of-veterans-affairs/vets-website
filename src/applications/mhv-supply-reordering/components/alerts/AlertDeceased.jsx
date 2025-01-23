import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const AlertDeceased = () => (
  <va-alert
    status="warning"
    data-testid="reorder-alert--deceased"
    class="vads-u-margin-bottom--5"
  >
    <h3 slot="headline">Our records show that this Veteran is deceased</h3>
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <span>We can’t fulfill an order for this Veteran</span>
      <span className="vads-u-margin-top--1">
        If this information is incorrect, please call Veterans Benefits
        Assistance at <va-telephone contact={CONTACTS.VA_BENEFITS} />
        <va-telephone contact={CONTACTS['711']} tty />, Monday through Friday,
        8:00 a.m. to 9:00 p.m. E.T.
      </span>
    </div>
  </va-alert>
);

export default AlertDeceased;
