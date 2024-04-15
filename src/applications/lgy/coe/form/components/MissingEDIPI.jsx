import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import recordEvent from 'platform/monitoring/record-event';

const MissingEDIPI = () => {
  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'error',
    'alert-box-heading': 'We need more information for your application',
    'error-key': 'missing_edipi',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
  });

  return (
    <va-alert status="error" uswds="false">
      <h2 className="vads-u-display--inline-block vads-u-font-size--h3 vads-u-margin-top--0">
        We need more information for your application
      </h2>
      <p className="vads-u-font-size--base">
        We don’t have all of your ID information for your account. We need this
        information before you can request a COE. To update your account, call
        Veterans Benefits Assistance at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
      <p className="vads-u-font-size--base">
        Tell the representative that you may be missing your{' '}
        <abbr title="Electronic Data Interchange Personal Identifier">
          EDIPI
        </abbr>{' '}
        number.
      </p>
    </va-alert>
  );
};

export default MissingEDIPI;
