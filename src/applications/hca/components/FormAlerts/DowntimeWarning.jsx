import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const DowntimeWarning = () => (
  <va-alert status="warning" uswds>
    <h2 slot="headline">The health care application is down for maintenance</h2>
    <p>
      We’re sorry. The health care application is currently down while we fix a
      few things. We’ll be back up as soon as we can.
    </p>
    <p>
      In the meantime, you can call{' '}
      <va-telephone contact={CONTACTS['222_VETS']} />, Monday through Friday,
      8:00 a.m. to 8:00 p.m.{' '}
      <dfn>
        <abbr title="Eastern Time">ET</abbr>
      </dfn>{' '}
      and press 2 to complete this application over the phone.
    </p>
  </va-alert>
);

export default DowntimeWarning;
