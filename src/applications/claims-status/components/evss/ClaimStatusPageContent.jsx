import React from 'react';
import PropTypes from 'prop-types';

import { getCompletedDate } from '../../utils/helpers';
import ClaimComplete from '../ClaimComplete';
import ClaimsDecision from '../ClaimsDecision';
import ClaimsTimeline from '../ClaimsTimeline';
import NeedFilesFromYou from '../NeedFilesFromYou';

const itemsNeedingAttentionFromVet = events => {
  return events?.filter(
    event =>
      event.status === 'NEEDED' && event.type === 'still_need_from_you_list',
  ).length;
};

export default function ClaimStatusPageContent({
  claim,
  showClaimLettersLink,
}) {
  // claim can be null
  const attributes = (claim && claim.attributes) || {};
  const { decisionLetterSent, open, phase } = attributes;

  const filesNeeded = itemsNeedingAttentionFromVet(attributes.eventsTimeline);
  const showDocsNeeded =
    !attributes.decisionLetterSent &&
    open &&
    attributes.documentsNeeded &&
    filesNeeded > 0;

  return (
    <div>
      {showDocsNeeded ? (
        <NeedFilesFromYou claimId={claim.id} files={filesNeeded} />
      ) : null}
      {decisionLetterSent && !open ? (
        <ClaimsDecision
          completedDate={getCompletedDate(claim)}
          showClaimLettersLink={showClaimLettersLink}
        />
      ) : null}
      {!decisionLetterSent && !open ? (
        <ClaimComplete completedDate={getCompletedDate(claim)} />
      ) : null}
      {phase !== null && open ? (
        <ClaimsTimeline
          id={claim.id}
          phase={phase}
          currentPhaseBack={attributes.currentPhaseBack}
          events={attributes.eventsTimeline}
        />
      ) : null}
    </div>
  );
}

ClaimStatusPageContent.propTypes = {
  showClaimLettersLink: PropTypes.bool.isRequired,
  claim: PropTypes.object,
};
