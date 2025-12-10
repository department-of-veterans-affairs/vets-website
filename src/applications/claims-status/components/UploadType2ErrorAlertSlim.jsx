import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordType2FailureEventListPage } from '../utils/analytics';

// Page-level coordination to count all slim alerts and fire one event
// This is shared across all instances of UploadType2ErrorAlertSlim
let visibleAlertsCount = 0;
let eventTimeoutId = null;

function UploadType2ErrorAlertSlim({ failedSubmissions }) {
  // Track mounting/unmounting and coordinate event firing
  // Fires on mount and whenever failedSubmissions changes
  useEffect(
    () => {
      if (failedSubmissions && failedSubmissions.length > 0) {
        visibleAlertsCount += 1;

        // Clear any previously scheduled event
        if (eventTimeoutId) {
          clearTimeout(eventTimeoutId);
        }

        // Schedule event to fire after all instances have had a chance to mount
        eventTimeoutId = setTimeout(() => {
          // Fire event with total count of all visible slim alerts
          recordType2FailureEventListPage({
            failedDocumentCount: visibleAlertsCount,
          });
          eventTimeoutId = null;
        }, 100);

        return () => {
          visibleAlertsCount -= 1;

          // If this was the last alert, clear any pending timeout and reset
          if (visibleAlertsCount === 0 && eventTimeoutId) {
            clearTimeout(eventTimeoutId);
            eventTimeoutId = null;
          }
        };
      }

      return undefined;
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
