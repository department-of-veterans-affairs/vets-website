import React from 'react';
import PropTypes from 'prop-types';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';
import recordEvent from 'platform/monitoring/record-event';

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

  return <VerifyAlert headingLevel={2} />;
};

NeedsToVerify.propTypes = {
  pathname: PropTypes.string,
};

export default NeedsToVerify;
