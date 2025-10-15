import PropTypes from 'prop-types';
import React from 'react';
import { getFilesNeeded } from '../../utils/helpers';
import FilesNeeded from '../claim-files-tab/FilesNeeded';
import UploadType2ErrorAlert from '../UploadType2ErrorAlert';

function WhatYouNeedToDo({ claim }) {
  const {
    evidenceWaiverSubmitted5103,
    trackedItems,
    evidenceSubmissions,
  } = claim.attributes;

  const filesNeeded = trackedItems
    ? // When user indicates they will not be submitting more evidence by adding a standard or automated 5103 waiver,
      // we will remove the automated 5103 request from the filesNeeded array, preventing the alert from showing.
      getFilesNeeded(trackedItems)
    : [];

  return (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        What you need to do
      </h3>

      {evidenceSubmissions.some(
        submission => submission.uploadStatus === 'FAILED',
      ) && <UploadType2ErrorAlert claim={claim} />}

      {filesNeeded.length === 0 && (
        <div className="no-documents">
          <p>
            There’s nothing we need from you right now. We’ll let you know when
            there’s an update.
          </p>
        </div>
      )}

      {filesNeeded.map(item => (
        <FilesNeeded
          key={item.id}
          id={claim.id}
          item={item}
          evidenceWaiverSubmitted5103={evidenceWaiverSubmitted5103}
          previousPage="status"
        />
      ))}
    </>
  );
}

WhatYouNeedToDo.propTypes = {
  claim: PropTypes.object,
};

export default WhatYouNeedToDo;
