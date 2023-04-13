import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

const GetFormHelp = () => (
  <div className="vads-u-margin-bottom--7">
    <p className="help-talk">
      <strong>If you have trouble using this online form,</strong> call us at{' '}
      <va-telephone contact={CONTACTS.VA_411} /> (
      <va-telephone contact={CONTACTS[711]} tty />
      ). We’re here {srSubstitute('24/7', '24 hours a day, 7 days a week')}.
    </p>
    <p className="help-talk">
      <strong>
        If you need help gathering your information or filling out your form,
      </strong>{' '}
      contact a local Veterans Service Organization (VSO).
    </p>
    <va-link
      href="https://va.gov/vso/"
      text="Find a local Veterans Service Organization"
    />
  </div>
);

export default GetFormHelp;
