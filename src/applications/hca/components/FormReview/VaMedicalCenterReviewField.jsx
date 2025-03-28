import React from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';

const VaMedicalCenterReviewField = ({ facilityName, stateLabel }) => (
  <>
    <div className="review-row">
      <dt>{content['facilities--state-label']}</dt>
      <dd data-testid="hca-facility-state">{stateLabel}</dd>
    </div>
    <div className="review-row">
      <dt>{content['facilities--clinic-label']}</dt>
      <dd data-testid="hca-facility-name">{facilityName}</dd>
    </div>
  </>
);

VaMedicalCenterReviewField.propTypes = {
  facilityName: PropTypes.string,
  stateLabel: PropTypes.string,
};

export { VaMedicalCenterReviewField };
