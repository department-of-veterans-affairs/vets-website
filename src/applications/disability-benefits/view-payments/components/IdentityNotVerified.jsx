import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

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
        className="usa-button-primary va-button-primary vads-u-font-size--base"
        href="/verify"
        onClick={() => recordEvent({ event: 'verify-link-clicked' })}
      >
        <img alt="ID.me logo" src="/img/signin/idme-icon-white.svg" />
        <strong>Verify my identity</strong>
      </a>
    </>
  );

  return (
    <va-alert status="warning">
      <h2 slot="headline" className="vads-u-fontsize--h3">
        Verify your identity to view your VA payments
      </h2>
      {content}
    </va-alert>
  );
};

export default IdentityNotVerified;
