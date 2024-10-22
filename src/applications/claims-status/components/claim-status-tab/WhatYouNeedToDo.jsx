import PropTypes from 'prop-types';
import React from 'react';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { getFilesNeeded, isAutomated5103Notice } from '../../utils/helpers';

import FilesNeeded from '../claim-files-tab/FilesNeeded';
import Standard5103Alert from '../claim-files-tab/Standard5103Alert';

function WhatYouNeedToDo({ claim }) {
  const {
    claimPhaseDates,
    evidenceWaiverSubmitted5103,
    trackedItems,
  } = claim.attributes;

  const filesNeeded = trackedItems
    ? // When user indicates they will not be submitting more evidence by adding a standard or automated 5103 waiver,
      // we will remove the automated 5103 request from the filesNeeded array, preventing the alert from showing.
      getFilesNeeded(trackedItems)
    : [];

  const standard5103NoticeExists =
    claimPhaseDates.latestPhaseType === 'GATHERING_OF_EVIDENCE' &&
    evidenceWaiverSubmitted5103 === false;
  const automated5103NoticeExists = filesNeeded.some(i =>
    isAutomated5103Notice(i.displayName),
  );

  return (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        What you need to do
      </h3>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.cst5103UpdateEnabled}>
        <Toggler.Disabled>
          {filesNeeded.length === 0 && (
            <div className="no-documents">
              <p>
                There’s nothing we need from you right now. We’ll let you know
                when there’s an update.
              </p>
            </div>
          )}
        </Toggler.Disabled>
        <Toggler.Enabled>
          {filesNeeded.length === 0 &&
            !standard5103NoticeExists && (
              <div className="no-documents">
                <p>
                  There’s nothing we need from you right now. We’ll let you know
                  when there’s an update.
                </p>
              </div>
            )}
          {standard5103NoticeExists &&
            !automated5103NoticeExists && (
              <Standard5103Alert previousPage="status" />
            )}
        </Toggler.Enabled>
      </Toggler>
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
