import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function VABenefitsCall() {
  return (
    <div>
      <p className="p1">
        <strong>To check on the status of your claim or appeal</strong>, use our{' '}
        <va-link
          href="/claim-or-appeal-status"
          text="online claim status tool"
        />
        .
      </p>
      <p className="p1">
        <strong>To get help with benefits</strong>, call{' '}
        <va-telephone
          contact={CONTACTS.VA_BENEFITS}
          message-aria-describedby="Get help with VA benefits"
        />{' '}
        toll-free. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        If you have hearing loss, call TTY:{' '}
        <va-telephone
          contact="711"
          message-aria-describedby="Get help with VA benefits (TTY number)"
        />
        .
      </p>
    </div>
  );
}
