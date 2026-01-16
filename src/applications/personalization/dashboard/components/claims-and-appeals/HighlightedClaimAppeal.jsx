import React from 'react';
import PropTypes from 'prop-types';
import { appealTypes } from '../../utils/appeals-helpers';

import ClaimLegacy from './ClaimLegacy';
import AppealLegacy from './AppealLegacy';

const HighlightedClaimAppeal = ({ claimOrAppeal, name }) => {
  if (!claimOrAppeal) {
    return <p>You have no claims or appeals updates in the last 30 days.</p>;
  }
  if (appealTypes.includes(claimOrAppeal.type)) {
    return <AppealLegacy appeal={claimOrAppeal} name={name} />;
  }
  return <ClaimLegacy claim={claimOrAppeal} />;
};

HighlightedClaimAppeal.propTypes = {
  claimOrAppeal: PropTypes.object.isRequired,
  name: PropTypes.string,
};

export default HighlightedClaimAppeal;
