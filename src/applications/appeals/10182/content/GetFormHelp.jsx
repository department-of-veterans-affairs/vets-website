import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

const GetFormHelp = () => (
  <>
    <p className="help-talk">
      If you have questions or need help filling out this form, call our{' '}
      {srSubstitute('MYVA411', 'My V. A. 4 1 1.')} main information line at{' '}
      <va-telephone contact={CONTACTS.HELP_DESK} /> and select 0. We’re here{' '}
      {srSubstitute('24/7', '24 hours a day, 7 days a week')}.
    </p>
    <p className="u-vads-margin-bottom--0">
      If you have hearing loss, call{' '}
      <va-telephone contact={CONTACTS['711']} tty />.
    </p>
  </>
);

export default GetFormHelp;
