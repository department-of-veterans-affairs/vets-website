import React from 'react';
import PropTypes from 'prop-types';
import { CLAIM_OWNERSHIPS } from '../definitions/constants';

const ClaimantPersInfoUiTitle = props => {
  const { formData } = props;

  if (formData.claimOwnership === CLAIM_OWNERSHIPS.THIRD_PARTY) {
    return (
      <legend className="vads-u-font-family--serif vads-u-font-size--h5 vads-u-font-weight--bold">
        Tell us about the person who has the existing claim
      </legend>
    );
  }

  return null;
};

ClaimantPersInfoUiTitle.propTypes = {
  formData: PropTypes.shape({
    claimOwnership: PropTypes.string.isRequired,
  }).isRequired,
};

export default ClaimantPersInfoUiTitle;
