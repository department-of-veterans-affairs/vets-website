import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

export const heading =
  'You’ll need to verify your identity to access more VA.gov tools and features';

const NeedsToVerify = ({ basename }) => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        focusElement(alertRef.current);
      }
    },
    [alertRef],
  );

  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'continue',
    'alert-box-heading': heading,
    'error-key': 'not_verified',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
    'reason-for-alert': `Not verified`,
  });

  return (
    <va-alert ref={alertRef} status="continue">
      <h2 slot="headline">{heading}</h2>
      <p>
        We need to make sure you’re you — and not someone pretending to be you —
        before we can give you access to your personal and health-related
        information. This helps to keep your information safe, and to prevent
        fraud and identity theft.
      </p>
      <strong>This one-time process takes about 5-10 minutes.</strong>
      <p>
        <a
          href={`/verify?next=${basename}`}
          className="verify-link vads-c-action-link--green"
        >
          Verify your identity to start your request
        </a>
      </p>
    </va-alert>
  );
};

NeedsToVerify.propTypes = {
  basename: PropTypes.string,
};

export default NeedsToVerify;
