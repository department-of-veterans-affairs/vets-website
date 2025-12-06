import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordType2FailureEvent } from '../utils/analytics';

function UploadType2ErrorAlertSlim({ failedSubmissions }) {
  const hasRecordedEvent = useRef(false);
  // Record Type 2 failure event when component mounts with failed submissions
  useEffect(
    () => {
      if (
        failedSubmissions &&
        failedSubmissions.length > 0 &&
        !hasRecordedEvent.current
      ) {
        recordType2FailureEvent({
          failedDocumentCount: failedSubmissions.length,
        });

        hasRecordedEvent.current = true;
      }
    },

    [failedSubmissions],
  );

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
