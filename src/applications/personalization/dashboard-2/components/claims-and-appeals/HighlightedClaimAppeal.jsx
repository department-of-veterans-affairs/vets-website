import React from 'react';

import { appealTypes } from '~/applications/claims-status/utils/appeals-v2-helpers';

import Claim from './Claim';
import Appeal from './Appeal';

const HighlightedClaimAppeal = ({ claimOrAppeal, name }) => {
  if (!claimOrAppeal) {
    return <p>You have no claims or appeals updates in the last 30 days.</p>;
  }
  if (appealTypes.includes(claimOrAppeal.type)) {
    return <Appeal appeal={claimOrAppeal} name={name} />;
  }
  return <Claim claim={claimOrAppeal} />;
};
export default HighlightedClaimAppeal;
