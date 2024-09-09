import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import { isDisabilityCompensationClaim } from '../../utils/helpers';

export default function ClaimOverviewHeader({ claimTypeCode }) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cstClaimPhasesEnabled = useToggleValue(TOGGLE_NAMES.cstClaimPhases);
  // When feature flag cstClaimPhases is enabled and claim type code is for a disability
  // compensation claim we show 8 phases instead of 5 with updated description, link text
  // and statuses
  const showEightPhases =
    cstClaimPhasesEnabled && isDisabilityCompensationClaim(claimTypeCode);
  const headerText = showEightPhases
    ? `There are 8 steps in the claim process. It’s common for claims to repeat steps 3 to 6 if we need more information.`
    : `Learn about the VA claim process and what happens after you file your claim.`;
  return (
    <div className="claim-overview-header-container">
      <h2 className="tab-header vads-u-margin-y--0">
        Overview of the claim process
      </h2>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--4 va-introtext">
        {headerText}
      </p>
    </div>
  );
}

ClaimOverviewHeader.propTypes = {
  claimTypeCode: PropTypes.string,
};
