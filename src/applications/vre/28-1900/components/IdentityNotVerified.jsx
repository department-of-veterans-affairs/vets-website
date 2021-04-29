import React from 'react';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import recordEvent from 'platform/monitoring/record-event';

const IdentityNotVerified = () => {
  const content = (
    <>
      <p>
        We need to make sure you’re you — and not someone pretending to be you —
        before we give you access to your personal and health-related
        information. This helps to keep your information safe and prevent fraud
        and identity theft.
      </p>
      <p>
        <strong>This one-time process takes about 5 to 10 minutes.</strong>
      </p>

      <a
        className="usa-button-primary va-button-primary"
        href="/verify"
        onClick={() => recordEvent({ event: 'verify-link-clicked' })}
      >
        <img alt="ID.me logo" src="/img/signin/idme-icon-white.svg" />
        <strong>Verify my identity</strong>
      </a>
    </>
  );

  return (
    <AlertBox
      headline="Verify your identity to view your VA payments"
      content={content}
      status={ALERT_TYPE.WARNING}
      className="vads-u-fontsize--h3"
      level="2"
    />
  );
};

export default IdentityNotVerified;
