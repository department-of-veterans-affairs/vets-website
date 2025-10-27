import PropTypes from 'prop-types';
import React from 'react';
import {
  VaAlert,
  VaLinkAction,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function UploadType2ErrorAlert({ failedSubmissions }) {
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
        {sortedSubmissions.slice(0, itemsToShow).map(submission => (
          <li key={submission.id}>
            <span>
              <strong>{submission.fileName}</strong>
            </span>
            <br />
            <span>File type: {submission.documentType}</span>
            <br />
            {submission.trackedItemDisplayName ? (
              <span>Request type: {submission.trackedItemDisplayName}</span>
            ) : (
              <span>You submitted this file as additional evidence</span>
            )}
          </li>
        ))}

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
      className="evidence-submission-type-2-alert"
      closeable={false}
      status="error"
      visible
    >
      <h3 className="usa-alert-heading">
        We need you to submit files by mail or in person
      </h3>
      <div className="vads-u-margin-y--0">{body}</div>
    </VaAlert>
  );
}

UploadType2ErrorAlert.propTypes = {
  failedSubmissions: PropTypes.array,
};

export default UploadType2ErrorAlert;
