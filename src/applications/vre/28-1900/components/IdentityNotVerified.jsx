import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';

const IdentityNotVerified = () => {
  const content = (
    <>
      <p className="vads-u-font-size--base">
        We need to make sure you’re you — and not someone pretending to be you —
        before we give you access to your personal and health-related
        information. This helps to keep your information safe and prevent fraud
        and identity theft.
      </p>
      <p className="vads-u-font-size--base">
        <strong>This one-time process takes about 5 to 10 minutes.</strong>
      </p>

      <a
        className="vads-c-action-link--green vads-u-font-size--base"
        href="/verify"
        onClick={() => recordEvent({ event: AUTH_EVENTS.VERIFY })}
      >
        <strong>Verify my identity</strong>
      </a>
    </>
  );

  return (
    <va-alert status="warning" uswds="false">
      <h2 slot="headline" className="vads-u-font-size--h3">
        Verify your identity to apply for VR&E benefits
      </h2>
      {content}
    </va-alert>
  );
};

export default IdentityNotVerified;
