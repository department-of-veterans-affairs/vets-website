import PropTypes from 'prop-types';
import React from 'react';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { getFilesNeeded } from '../../utils/helpers';

import FilesNeeded from '../claim-files-tab/FilesNeeded';
import Standard5103Alert from '../claim-files-tab/Standard5103Alert';

function WhatYouNeedToDo({ claim }) {
  const {
    claimPhaseDates,
    evidenceWaiverSubmitted5103,
    trackedItems,
  } = claim.attributes;
  const filesNeeded = getFilesNeeded(trackedItems);
  const standard5103NoticeExists =
    claimPhaseDates.latestPhaseType === 'GATHERING_OF_EVIDENCE' &&
    evidenceWaiverSubmitted5103 === false;
  const automated5103NoticeExists = filesNeeded.some(
    i => i.displayName === 'Automated 5103 Notice Response',
  );

  return (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        What you need to do
      </h3>
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
      <Toggler toggleName={Toggler.TOGGLE_NAMES.cst5103UpdateEnabled}>
        <Toggler.Enabled>
          {standard5103NoticeExists &&
            !automated5103NoticeExists && (
              <Standard5103Alert previousPage="status" />
            )}
        </Toggler.Enabled>
      </Toggler>
    </>
  );
}

WhatYouNeedToDo.propTypes = {
  claim: PropTypes.object,
};

export default WhatYouNeedToDo;
