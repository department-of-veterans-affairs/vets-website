import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordType2FailureEvent } from '../utils/analytics';

// Page-level tracking to ensure only one event fires per page load
// This is shared across all instances of UploadType2ErrorAlertSlim
let pageHasRecordedEvent = false;
let mountedInstanceCount = 0;

function UploadType2ErrorAlertSlim({ failedSubmissions }) {
  const hasRecordedEvent = useRef(false);

  // Track mounting/unmounting to reset page flag when all instances are gone
  useEffect(() => {
    mountedInstanceCount += 1;

    return () => {
      mountedInstanceCount -= 1;
      // Reset the page flag when all instances have unmounted
      if (mountedInstanceCount === 0) {
        pageHasRecordedEvent = false;
      }
    };
  }, []);

  // Record Type 2 failure event when component mounts with failed submissions
  // Only the first slim alert to mount will fire the event (page-level tracking)
  // Only records once per session to avoid inflating error counts
  useEffect(
    () => {
      const sessionKey = 'cst_type2_failure_recorded';
      const hasRecordedInSession = sessionStorage.getItem(sessionKey);

      if (
        failedSubmissions &&
        failedSubmissions.length > 0 &&
        !hasRecordedEvent.current &&
        !pageHasRecordedEvent &&
        !hasRecordedInSession
      ) {
        recordType2FailureEvent({
          failedDocumentCount: failedSubmissions.length,
        });

        hasRecordedEvent.current = true;
        pageHasRecordedEvent = true;
        sessionStorage.setItem(sessionKey, 'true');
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
