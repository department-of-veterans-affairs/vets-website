import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Toggler } from 'platform/utilities/feature-toggles';
import * as TrackedItem from '../../utils/trackedItemContent';
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
      TrackedItem.getFilesNeeded(trackedItems)
    : [];

  // Memoize failed submissions to prevent UploadType2ErrorAlert from receiving
  // a new array reference on every render, which would break its useEffect tracking
  const failedSubmissionsWithinLast30Days = useMemo(
    () => TrackedItem.getFailedSubmissionsWithinLast30Days(evidenceSubmissions),
    [evidenceSubmissions],
  );
  const nothingNeededMessage = (
    <div className="no-documents">
      <p>
        There’s nothing we need from you right now. We’ll let you know when
        there’s an update.
      </p>
    </div>
  );

  return (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        What you need to do
      </h3>

      <Toggler toggleName={Toggler.TOGGLE_NAMES.cstShowDocumentUploadStatus}>
        <Toggler.Enabled>
          <UploadType2ErrorAlert
            failedSubmissions={failedSubmissionsWithinLast30Days}
            isStatusPage
          />
          {filesNeeded.length === 0 &&
            failedSubmissionsWithinLast30Days.length === 0 &&
            nothingNeededMessage}
        </Toggler.Enabled>
        <Toggler.Disabled>
          {filesNeeded.length === 0 && nothingNeededMessage}
        </Toggler.Disabled>
      </Toggler>
      {filesNeeded.map(item => (
        <FilesNeeded
          key={item.id}
          claimId={claim.id}
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
