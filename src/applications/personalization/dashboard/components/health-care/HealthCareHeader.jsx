import React from 'react';
import PropTypes from 'prop-types';

export default function HealthCareHeader({ classes = '' }) {
  return (
    <h2 data-testid="health-care-section-header" className={classes}>
      Health Care
    </h2>
  );
}

HealthCareHeader.propTypes = {
  classes: PropTypes.string,
};
