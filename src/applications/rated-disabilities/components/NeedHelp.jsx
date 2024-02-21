import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function NeedHelp() {
  return (
    <va-need-help class="vads-u-margin-y--3">
      <div slot="content">
        <p>
          You can call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />.
          We’re We’re here Monday through Friday, 8:00 a.m to 9:00 p.m. ET. If
          you have hearing loss, call{' '}
          <va-telephone contact={CONTACTS['711']} tty />
        </p>
      </div>
    </va-need-help>
  );
}
