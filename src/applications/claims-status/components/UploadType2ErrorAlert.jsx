import PropTypes from 'prop-types';
import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function UploadType2ErrorAlert({ claim }) {
  const { evidenceSubmissions } = claim.attributes;
  const failedFiles = evidenceSubmissions.filter(
    submission => submission.uploadStatus === 'FAILED',
  );

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
        {failedFiles.map(submission => (
          <li key={submission.id}>
            <span>
              <strong>{submission.fileName}</strong>
            </span>
            <br />
            <span>File type: {submission.documentType}</span>
            {submission.trackedItemDisplayName && (
              <>
                <br />
                <span>Request type: {submission.trackedItemDisplayName}</span>
              </>
            )}
          </li>
        ))}
        {failedFiles.length > 2 && (
          <li>And {failedFiles.length - 2} more within the last 30 days</li>
        )}
      </ul>
      If you’ve already submitted these files another way, you can ignore this
      message. We’ll remove these alerts 30 days after the upload failed.
    </>
  );

  return (
    <>
      <VaAlert
        data-testid="notification"
        close-btn-aria-label="Close notification"
        className="claims-alert"
        closeable={false}
        onCloseEvent={() => {}}
        status="error"
        visible
      >
        <h2 slot="headline">
          We need you to submit files by mail or in person
        </h2>
        <div className="vads-u-margin-y--0">{body}</div>
      </VaAlert>
    </>
  );
}

UploadType2ErrorAlert.propTypes = {
  claim: PropTypes.object,
};

export default UploadType2ErrorAlert;
