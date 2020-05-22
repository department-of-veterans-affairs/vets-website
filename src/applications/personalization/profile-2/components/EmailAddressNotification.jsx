import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

const EmailAddressNotification = () => (
  <>
    <p className="vads-u-margin--0">
      To update the email address you use to sign in, go to the account where
      you manage your settings and identity information. Any email updates you
      make there will automatically update on VA.gov.
    </p>
    <p className="vads-u-margin-bottom--0">
      <a
        href="https://wallet.id.me/settings"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          recordEvent({ event: 'update-sign-in-email-address-clicked' });
        }}
      >
        Update email address on ID.me
      </a>
    </p>
  </>
);

export default EmailAddressNotification;
