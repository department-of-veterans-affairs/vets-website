import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Toggler, useFeatureToggle } from 'platform/utilities/feature-toggles';
import {
  getFilesNeeded,
  getFilesNeededWithoutActiveSubmissions,
  getFailedSubmissionsWithinLast30Days,
} from '../../utils/helpers';
import FilesNeeded from '../claim-files-tab/FilesNeeded';
import UploadType2ErrorAlert from '../UploadType2ErrorAlert';
import { DemoNotation } from '../../demo';

function WhatYouNeedToDo({ claim }) {
  const {
    evidenceWaiverSubmitted5103,
    trackedItems,
    evidenceSubmissions,
  } = claim.attributes;

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const showDocumentUploadStatus = useToggleValue(
    TOGGLE_NAMES.cstShowDocumentUploadStatus,
  );

  // Get tracked items that still need action from the user.
  // When showDocumentUploadStatus is enabled, also filter out items that have
  // an active (non-failed) evidence submission, since the user has already responded
  // and the submission is being processed.
  const getFilesNeededForDisplay = () => {
    if (!trackedItems) {
      return [];
    }
    if (showDocumentUploadStatus) {
      return getFilesNeededWithoutActiveSubmissions(
        trackedItems,
        evidenceSubmissions,
      );
    }
    return getFilesNeeded(trackedItems);
  };

  const filesNeeded = getFilesNeededForDisplay();

  // Memoize failed submissions to prevent UploadType2ErrorAlert from receiving
  // a new array reference on every render, which would break its useEffect tracking
  const failedSubmissionsWithinLast30Days = useMemo(
    () => getFailedSubmissionsWithinLast30Days(evidenceSubmissions),
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

  // Check if any tracked items were hidden due to active submissions
  const allFilesNeeded = trackedItems ? getFilesNeeded(trackedItems) : [];
  const hiddenDueToSubmission =
    showDocumentUploadStatus && allFilesNeeded.length > filesNeeded.length;

  return (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
        What you need to do
      </h3>
      <DemoNotation
        theme="new"
        title="What you need to do — Body copy"
        before="No introductory body copy"
        after="Clarifying paragraph about accepting responses after request date"
        description="This information was previously only noted if the Veteran clicked into a request that was past the respond by date (in a warning alert)."
      />
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        We identified this information as needed to support your claim. We
        accept responses after the request date, but we may review your claim
        without it.
      </p>

      {hiddenDueToSubmission && (
        <DemoNotation
          theme="change"
          title="Tracked item card hidden"
          before="Card remained visible until NEEDED_FROM_YOU becomes a different status"
          after="Card hides immediately after upload — appears in 'File submissions in progress' instead"
          description="Filters out NEEDED_FROM_YOU tracked items that already have a non-failed evidence submission, so the card disappears as soon as the upload starts processing. The card reappears if the submission fails."
        />
      )}

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
      <DemoNotation
        theme="change"
        title="DS updates: Card"
        before="Yellow warning alert (va-alert)"
        after="Card component (va-card)"
      />
      <DemoNotation
        theme="change"
        title="DS updates: Critical Action"
        before="Link action on alert (VaLinkAction)"
        after="Critical Action component (VaCriticalAction)"
      />
      <DemoNotation
        theme="change"
        title="Update content"
        before={'"About this request" link text'}
        after={
          '"Requested by [date]" on Critical Action component for all requests'
        }
      />
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
