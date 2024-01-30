import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

const NeedsToVerify = ({ pathname }) => {
  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'continue',
    'alert-box-heading':
      'You’ll need to verify your identity to access more VA.gov tools and features',
    'error-key': 'not_verified',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
    'reason-for-alert': `Not verified`,
  });

  return (
    <va-alert status="continue" uswds>
      <h2 slot="headline">
        You’ll need to verify your identity to access more VA.gov tools and
        features
      </h2>
      <p>
        We need to make sure you’re you — and not someone pretending to be you —
        before we can give you access to your personal and health-related
        information. This helps to keep your information safe, and to prevent
        fraud and identity theft.
      </p>
      <strong>This one-time process takes about 5-10 minutes.</strong>
      <p>
        <a
          href={`/verify?next=${pathname}`}
          className="verify-link vads-c-action-link--green"
        >
          Verify your identity to start your request
        </a>
      </p>
    </va-alert>
  );
};

NeedsToVerify.propTypes = {
  pathname: PropTypes.string,
};

export default NeedsToVerify;
