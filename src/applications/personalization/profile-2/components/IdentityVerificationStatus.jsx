import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

import Verified from './Verified';

const IdentityVerificationStatus = ({ isIdentityVerified }) => {
  if (isIdentityVerified) {
    return <Verified>We’ve verified your identity.</Verified>;
  }
  return (
    <>
      <p className="vads-u-margin--0">
        We need to make sure you’re you — and not someone pretending to be you —
        before we can give you access to your personal and health-related
        information. This helps to keep your information safe, and to prevent
        fraud and identity theft.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a
          href="/verify?next=/profile"
          onClick={() => {
            recordEvent({ event: 'verify-link-clicked' });
          }}
        >
          Verify your identity
        </a>
      </p>
    </>
  );
};

export default IdentityVerificationStatus;
