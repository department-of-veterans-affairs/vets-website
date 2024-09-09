import React from 'react';
import PropTypes from 'prop-types';

const VaMedicalCenterReviewField = ({ facilityName, stateLabel }) => (
  <>
    <div className="review-row">
      <dt>State</dt>
      <dd data-testid="hca-facility-state">{stateLabel}</dd>
    </div>
    <div className="review-row">
      <dt>Center or clinic</dt>
      <dd data-testid="hca-facility-name">{facilityName}</dd>
    </div>
  </>
);

VaMedicalCenterReviewField.propTypes = {
  facilityName: PropTypes.string,
  stateLabel: PropTypes.string,
};

export { VaMedicalCenterReviewField };
