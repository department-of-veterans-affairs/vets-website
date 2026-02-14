import React from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ANCHOR_LINKS } from '../../constants';

const FilesWeCouldntReceiveEntryPoint = ({ evidenceSubmissions }) => {
  // Check if there are any failed uploads
  const hasFailedUploads =
    evidenceSubmissions &&
    evidenceSubmissions.some(es => es.uploadStatus === 'FAILED');

  // Don't render if there are no failed uploads
  if (!hasFailedUploads) {
    return null;
  }

  return (
    <div
      className="files-we-couldnt-receive-entry-point"
      data-testid="files-we-couldnt-receive-entry-point"
    >
      <h3
        className="vads-u-margin-top--0 vads-u-margin-bottom--3"
        id={ANCHOR_LINKS.filesWeCouldntReceive}
      >
        Files we couldn’t receive
      </h3>
      <p>
        Some files you submitted we couldn’t receive because of a problem with
        our system. You should have received an email from us with more details.
        You’ll need to resubmit these documents by mail or in person. We’re
        sorry about this.
      </p>
      <VaLink
        href="../files-we-couldnt-receive"
        text="Learn which files we couldn’t receive and other ways to send your documents"
      />
      <div className="vads-u-margin-y--6 vads-u-border--1px vads-u-border-color--gray-light" />
    </div>
  );
};

FilesWeCouldntReceiveEntryPoint.propTypes = {
  evidenceSubmissions: PropTypes.array,
};

export default FilesWeCouldntReceiveEntryPoint;
