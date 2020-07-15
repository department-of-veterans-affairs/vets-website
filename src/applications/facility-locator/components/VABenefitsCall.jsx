import React from 'react';
import { parsePhoneNumber } from '../utils/phoneNumbers';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

const { formattedPhoneNumber, extension, contact } = parsePhoneNumber(
  '800-827-1000',
);

export default function VABenefitsCall() {
  return (
    <div>
      <p className="p1">
        <strong>To check on the status of your claim or appeal</strong>, use our{' '}
        <a href="/claim-or-appeal-status">online claim status tool</a>.
      </p>
      <p className="p1">
        <strong>To get help with benefits</strong>, call{' '}
        <Telephone contact={contact} extension={extension}>
          {' '}
          {formattedPhoneNumber}
        </Telephone>{' '}
        toll-free. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        If you have hearing loss, call TTY 711.
      </p>
      <p className="p1">
        <strong>For other benefit questions</strong>, use our online customer
        service tool called{' '}
        <a href="https://iris.custhelp.va.gov/">
          IRIS (Inquiry Routing & Information System)
        </a>
        .
      </p>
    </div>
  );
}
