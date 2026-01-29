import React from 'react';
import PropTypes from 'prop-types';
import { RefillAlert } from './RefillAlert';
import { RefillMedicationList } from './RefillMedicationList';

export const PartialRefillNotification = ({ config, failedMeds }) => (
  <RefillAlert config={config}>
    <p data-testid="partial-refill-description">{config.description}</p>
    <RefillMedicationList
      medications={failedMeds}
      testId="failed-medication-list"
      showBold
    />
    <p
      className="vads-u-margin-bottom--0"
      data-testid="partial-refill-suggestion"
    >
      {config.suggestion}
    </p>
  </RefillAlert>
);

PartialRefillNotification.propTypes = {
  config: PropTypes.shape({
    className: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    suggestion: PropTypes.string.isRequired,
    testId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  failedMeds: PropTypes.array.isRequired,
};

export default PartialRefillNotification;
