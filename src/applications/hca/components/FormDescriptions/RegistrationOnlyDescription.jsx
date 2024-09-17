import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const RegistrationOnlyDescription = (
  <>
    <p>
      You have the option to register for health care for your service-connected
      conditions only without enrolling in our full medical benefits package.
    </p>
    <p>
      <strong>Note:</strong> If you’re not sure which option to select, we
      recommend calling our Health Eligibility Center at{' '}
      <va-telephone contact={CONTACTS['222_VETS']} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
      <dfn>
        <abbr title="Eastern Time">ET</abbr>
      </dfn>
      .
    </p>
  </>
);

export default RegistrationOnlyDescription;
