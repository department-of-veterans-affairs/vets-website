import React from 'react';
import PropTypes from 'prop-types';
import { appealTypes } from '../../utils/appeals-v2-helpers';

import Claim from './Claim';
import Appeal from './Appeal';

const HighlightedClaimAppeal = ({
  claimOrAppeal,
  name,
  useLighthouseClaims = false,
}) => {
  if (!claimOrAppeal) {
    return <p>You have no claims or appeals updates in the last 30 days.</p>;
  }
  if (appealTypes.includes(claimOrAppeal.type)) {
    return <Appeal appeal={claimOrAppeal} name={name} />;
  }
  return (
    <Claim claim={claimOrAppeal} useLighthouseClaims={useLighthouseClaims} />
  );
};

HighlightedClaimAppeal.propTypes = {
  claimOrAppeal: PropTypes.object.isRequired,
  name: PropTypes.string,
  useLighthouseClaims: PropTypes.bool,
};

export default HighlightedClaimAppeal;
