import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

const GetFormHelp = () => (
  <p className="help-talk">
    If you need help with this form, call us at{' '}
    <va-telephone contact={CONTACTS.VA_411} /> (
    <va-telephone contact={CONTACTS[711]} tty />
    ). Then select 0. We’re here{' '}
    {srSubstitute('24/7', '24 hours a day, 7 days a week')}.
  </p>
);

export default GetFormHelp;
