import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

const GetFormHelp = () => (
  <>
    <p className="help-talk">
      If you have questions or need help filling out this form, please call our{' '}
      {srSubstitute('MYVA411', 'My V. A. 4 1 1.')} main information line at{' '}
      <Telephone contact={CONTACTS.HELP_DESK} /> and select 0. We’re here{' '}
      {srSubstitute('24/7', '24 hours a day, 7 days a week')}.
    </p>
    <p className="u-vads-margin-bottom--0">
      If you have hearing loss, call TTY:{' '}
      <Telephone
        contact={CONTACTS['711']}
        pattern={'###'}
        ariaLabel={'7 1 1.'}
      />
      .
    </p>
  </>
);

export default GetFormHelp;
