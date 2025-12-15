import PropTypes from 'prop-types';
import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function UploadType2ErrorAlertSlim({ failedSubmissions }) {
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
  failedSubmissions: PropTypes.array,
};

export default UploadType2ErrorAlertSlim;
