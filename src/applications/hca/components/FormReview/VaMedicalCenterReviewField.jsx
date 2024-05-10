import React from 'react';
import PropTypes from 'prop-types';
import constants from 'vets-json-schema/dist/constants.json';

const VaMedicalCenterReviewField = ({ stateCode, facilityName }) => {
  const stateLabel = constants.states.USA.find(s => s.value === stateCode)
    .label;
  return (
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
};

VaMedicalCenterReviewField.propTypes = {
  facilityName: PropTypes.string,
  stateCode: PropTypes.string,
};

export { VaMedicalCenterReviewField };
