import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';

export const Error500 = () => {
  return (
    <va-alert status="error">
      <h3 slot="headline">We’re sorry. Something went wrong on our end</h3>
      <p>
        Please refresh this page or check back later. You can also sign out of
        VA.gov and try signing back into this page.
      </p>
      <p>
        If you get this error again, please call the VA.gov help desk at{' '}
        <va-telephone contact="8446982311" /> (TTY:{' '}
        <va-telephone contact={CONTACTS['711']} />
        ). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m. ET.
      </p>
    </va-alert>
  );
};
