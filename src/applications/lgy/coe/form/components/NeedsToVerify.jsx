import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import VerifyAlert from 'platform/user/authentication/components/VerifyAlert';

const NeedsToVerify = () => {
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

  return <VerifyAlert />;
};

export default NeedsToVerify;
