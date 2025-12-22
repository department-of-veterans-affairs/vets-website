import PropTypes from 'prop-types';
import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSlimAlertRegistration } from '../contexts/Type2FailureAnalyticsContext';

function UploadType2ErrorAlertSlim({ failedSubmissions, claimId }) {
  const hasFailures = failedSubmissions && failedSubmissions.length > 0;

  // Register this alert with the analytics coordinator
  // Coordinator will fire a single event with total count after all alerts mount
  useSlimAlertRegistration({
    alertKey: claimId,
    hasFailures,
  });

  // Don't render anything if there are no failed submissions
  if (!failedSubmissions || failedSubmissions.length === 0) {
    return null;
  }

  return (
    <div className="vads-u-margin-y--2">
      <VaAlert slim status="error" visible>
        <p className="vads-u-margin-y--0">
          We need you to resubmit files for this claim.
        </p>
      </VaAlert>
    </div>
  );
}

UploadType2ErrorAlertSlim.propTypes = {
  claimId: PropTypes.string.isRequired,
  failedSubmissions: PropTypes.array,
};

export default UploadType2ErrorAlertSlim;
