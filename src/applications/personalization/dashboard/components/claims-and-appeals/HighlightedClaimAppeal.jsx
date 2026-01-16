import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { appealTypes } from '../../utils/appeals-helpers';

import ClaimLegacy from './ClaimLegacy';
import AppealLegacy from './AppealLegacy';
import ClaimRedesign from './Claim';
import AppealRedesign from './Appeal';

const HighlightedClaimAppeal = ({ claimOrAppeal, name }) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();

  const isRedesign = useToggleValue(TOGGLE_NAMES.myVaAuthExpRedesignEnabled);

  const Appeal = isRedesign ? AppealRedesign : AppealLegacy;
  const Claim = isRedesign ? ClaimRedesign : ClaimLegacy;

  if (!claimOrAppeal) {
    return <p>You have no claims or appeals updates in the last 30 days.</p>;
  }
  if (appealTypes.includes(claimOrAppeal.type)) {
    return <Appeal appeal={claimOrAppeal} name={name} />;
  }
  return <Claim claim={claimOrAppeal} />;
};

HighlightedClaimAppeal.propTypes = {
  claimOrAppeal: PropTypes.object.isRequired,
  name: PropTypes.string,
};

export default HighlightedClaimAppeal;
