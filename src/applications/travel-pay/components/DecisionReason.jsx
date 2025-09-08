import React from 'react';
import PropTypes from 'prop-types';

import { STATUSES } from '../constants';

const DecisionReason = ({ claimStatus, decisionLetterReason }) => (
  <>
    <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
      {claimStatus === STATUSES.Denied.name
        ? 'Why we denied your claim'
        : 'Why we made a partial payment'}{' '}
    </p>
    <p className="vads-u-margin-top--0">{decisionLetterReason}</p>
  </>
);

DecisionReason.propTypes = {
  claimStatus: PropTypes.string,
  decisionLetterReason: PropTypes.string,
};

export default DecisionReason;
