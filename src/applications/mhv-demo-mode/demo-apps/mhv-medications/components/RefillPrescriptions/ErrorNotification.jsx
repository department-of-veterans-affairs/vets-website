import React from 'react';
import PropTypes from 'prop-types';
import { RefillAlert } from './RefillAlert';

export const ErrorNotification = ({ config }) => (
  <RefillAlert config={config}>
    <p data-testid="error-refill-description">{config.description}</p>
    <p data-testid="error-refill-suggestion">{config.suggestion}</p>
  </RefillAlert>
);

ErrorNotification.propTypes = {
  config: PropTypes.shape({
    className: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    suggestion: PropTypes.string.isRequired,
    testId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default ErrorNotification;
