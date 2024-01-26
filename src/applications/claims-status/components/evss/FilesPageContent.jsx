import React from 'react';
import PropTypes from 'prop-types';

import AdditionalEvidenceItem from './AdditionalEvidenceItem';
import AskVAToDecide from '../AskVAToDecide';
import RequestedFilesInfo from '../RequestedFilesInfo';
import SubmittedTrackedItem from './SubmittedTrackedItem';
import AdditionalEvidencePage from '../../containers/AdditionalEvidencePage';

import { getFilesNeeded, getFilesOptional } from '../../utils/helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';

const NEED_ITEMS_STATUS = 'NEEDED';
const FIRST_GATHERING_EVIDENCE_PHASE = 3;

export default function FilesPageContent({ claim, params }) {
  const showDecision =
    claim.attributes.phase === FIRST_GATHERING_EVIDENCE_PHASE &&
    !claim.attributes.waiverSubmitted;
  const trackedItems = claim.attributes.eventsTimeline.filter(event =>
    event.type.endsWith('_list'),
  );

  const filesNeeded = getFilesNeeded(trackedItems, false);
  const optionalFiles = getFilesOptional(trackedItems, false);
  const documentsTurnedIn = trackedItems.filter(
    event =>
      event.status !== NEED_ITEMS_STATUS ||
      !event.type.startsWith('still_need_from'),
  );

  return (
    <div>
      {claim.attributes.open && (
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstUseClaimDetailsV2}>
          <Toggler.Disabled>
            <RequestedFilesInfo
              id={claim.id}
              filesNeeded={filesNeeded}
              optionalFiles={optionalFiles}
            />
          </Toggler.Disabled>
          <Toggler.Enabled>
            <AdditionalEvidencePage />
          </Toggler.Enabled>
        </Toggler>
      )}
      {showDecision && <AskVAToDecide id={params.id} />}
      <div className="submitted-files-list">
        <h2 className="claim-file-border">Documents filed</h2>
        {documentsTurnedIn.length === 0 ? (
          <div>
            <p>You haven’t turned in any documents to VA.</p>
          </div>
        ) : null}

        {documentsTurnedIn.map(
          (item, itemIndex) =>
            item.trackedItemId ? (
              <SubmittedTrackedItem item={item} key={itemIndex} />
            ) : (
              <AdditionalEvidenceItem item={item} key={itemIndex} />
            ),
        )}
      </div>
    </div>
  );
}

FilesPageContent.propTypes = {
  claim: PropTypes.object,
  params: PropTypes.object,
};
