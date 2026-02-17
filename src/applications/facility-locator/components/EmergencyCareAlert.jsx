import React from 'react';
import PropTypes from 'prop-types';

function EmergencyCareAlert({ shouldShow = false }) {
  if (!shouldShow) {
    return null;
  }
  return (
    <va-alert
      slim
      full-width
      status="info"
      class="vads-u-margin-top--1"
      data-testid="emergency-care-info-note"
      id="emergency-care-info-note"
    >
      <strong>Note:</strong> If you think your life or health is in danger, call{' '}
      <va-telephone contact="911" /> or go to the nearest emergency department
      right away!
    </va-alert>
  );
}

EmergencyCareAlert.propTypes = {
  shouldShow: PropTypes.bool,
};

export default EmergencyCareAlert;
