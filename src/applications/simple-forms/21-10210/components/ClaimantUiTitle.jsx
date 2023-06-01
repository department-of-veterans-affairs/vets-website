import React from 'react';
import PropTypes from 'prop-types';
import { CLAIM_OWNERSHIPS } from '../definitions/constants';

const ClaimantUiTitle = props => {
  const { formData } = props;

  if (formData.claimOwnership === CLAIM_OWNERSHIPS.THIRD_PARTY) {
    return (
      <span className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold">
        Tell us about the person who has the existing claim
      </span>
    );
  }

  return null;
};

ClaimantUiTitle.propTypes = {
  formData: PropTypes.shape({
    claimOwnership: PropTypes.string.isRequired,
  }).isRequired,
};

export default ClaimantUiTitle;
