import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {
  VaAlert,
  VaLinkAction,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import * as TrackedItem from '../utils/trackedItemContent';
import { recordType2FailureEvent } from '../utils/analytics';

const HEADING = 'We need you to submit files by mail or in person';

function UploadType2ErrorAlert({ failedSubmissions, isStatusPage }) {
  // Record Type 2 failure event every time component mounts with failed submissions
  // Only fires on status page
  useEffect(
    () => {
      if (failedSubmissions && failedSubmissions.length > 0 && isStatusPage) {
        recordType2FailureEvent({ count: 1 });
      }
    },
    [failedSubmissions, isStatusPage],
  );

  // Don't render anything if there are no failed submissions
  if (!failedSubmissions || failedSubmissions.length === 0) {
    return null;
  }

  // Sort submissions by failedDate (most recent first)
  const sortedSubmissions = [...failedSubmissions].sort((a, b) => {
    const dateA = new Date(a.failedDate || 0);
    const dateB = new Date(b.failedDate || 0);
    return dateB - dateA;
  });

  // Determine how many items to display
  const itemsToShow =
    sortedSubmissions.length > 2 ? 1 : sortedSubmissions.length;

  const body = (
    <>
      <p>
        We’re sorry. There was a problem with our system, and we couldn’t
        process the files you tried to submit. You can submit these files by
        mail or in person instead.
      </p>
      <p>
        If you try to submit these files again in this tool, we expect we’ll
        have the same problem.
      </p>
      <strong>All files we couldn’t process:</strong>
      <ul>
        {sortedSubmissions.slice(0, itemsToShow).map(submission => {
          const requestType = TrackedItem.getTrackedItemDisplayNameFromEvidenceSubmission(
            submission,
          );

          return (
            <li key={submission.id}>
              <span>
                <strong>{submission.fileName}</strong>
              </span>
              <br />
              <span>File type: {submission.documentType}</span>
              <br />
              {requestType ? (
                <span>Request type: {requestType}</span>
              ) : (
                <span>You submitted this file as additional evidence</span>
              )}
            </li>
          );
        })}

        {sortedSubmissions.length > 2 && (
          <li>
            <strong>
              And {sortedSubmissions.length - 1} more within the last 30 days
            </strong>
          </li>
        )}
      </ul>
      <p>
        If you’ve already submitted these files another way, you can ignore this
        message. We’ll remove these alerts 30 days after the upload failed.
      </p>
      <VaLinkAction
        href="../files-we-couldnt-receive"
        text="Review files we couldn't process and learn other ways to send your documents"
        type="secondary"
      />
    </>
  );

  return (
    <VaAlert
      data-testid="notification"
      close-btn-aria-label="Close notification"
      className="evidence-submission-type-2-alert vads-u-margin-y--4"
      closeable={false}
      status="error"
      visible
    >
      {isStatusPage ? (
        <h4 className="usa-alert-heading vads-u-font-size--h3">{HEADING}</h4>
      ) : (
        <h3 className="usa-alert-heading">{HEADING}</h3>
      )}
      <div className="vads-u-margin-y--0">{body}</div>
    </VaAlert>
  );
}

UploadType2ErrorAlert.propTypes = {
  failedSubmissions: PropTypes.array,
  isStatusPage: PropTypes.bool,
};

export default UploadType2ErrorAlert;
