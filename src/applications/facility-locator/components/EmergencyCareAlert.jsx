import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function EmregencyCareAlert({ shouldShow = false }) {
  if (!shouldShow) {
    return null;
  }
  return (
    <VaAlert
      slim
      uswds
      fullWidth
      status="info"
      className="vads-u-margin-top--1"
      data-testid="emergency-care-info-note"
      id="emergency-care-info-note"
    >
      <strong>Note:</strong> If you think your life or health is in danger, call{' '}
      <va-telephone contact="911" /> or go to the nearest emergency department
      right away.
    </VaAlert>
  );
}

EmregencyCareAlert.propTypes = {
  shouldShow: PropTypes.bool,
};
