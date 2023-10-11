import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function VABenefitsCall() {
  return (
    <div>
      <p className="p1">
        <strong>To check on the status of your claim or appeal</strong>, use our{' '}
        <a href="/claim-or-appeal-status">online claim status tool</a>.
      </p>
      <p className="p1">
        <strong>To get help with benefits</strong>, call{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> toll-free. We’re here
        Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have hearing{' '}
        loss, call TTY: <va-telephone contact="711" />.
      </p>
    </div>
  );
}
