import React from 'react';
import PropTypes from 'prop-types';
import { appealTypes } from '../../utils/appeals-v2-helpers';

import Claim from './ClaimV2';
import Appeal from './AppealV2';

const HighlightedClaimAppealV2 = ({ claimOrAppeal, name }) => {
  if (!claimOrAppeal) {
    return <p>You have no claims or appeals updates in the last 30 days.</p>;
  }
  if (appealTypes.includes(claimOrAppeal.type)) {
    return <Appeal appeal={claimOrAppeal} name={name} />;
  }
  return <Claim claim={claimOrAppeal} />;
};

HighlightedClaimAppealV2.propTypes = {
  claimOrAppeal: PropTypes.object.isRequired,
  name: PropTypes.string,
};

export default HighlightedClaimAppealV2;
