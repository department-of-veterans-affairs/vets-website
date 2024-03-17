import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function ServerError() {
  return (
    <va-alert status="error" uswds>
      <h2 slot="headline">We’re sorry. Something went wrong on our end.</h2>
      <p className="vads-u-font-size--base">
        Please refresh this page or check back later. You can also sign out of
        VA.gov and try signing back into this page.
      </p>
      <p className="vads-u-font-size--base">
        If you get this error again, please call the VA.gov help desk at{' '}
        <va-telephone contact={CONTACTS.VA_311} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </va-alert>
  );
}
