import React from 'react';
import PropTypes from 'prop-types';

const loadingIndicator = (
  <va-loading-indicator
    data-testid="feature-flags-loading"
    message="Loading your information..."
  />
);

export default function AppContent({ children, featureFlagsLoading }) {
  return !featureFlagsLoading ? children : loadingIndicator;
}

AppContent.propTypes = {
  children: PropTypes.node,
  featureFlagsLoading: PropTypes.bool,
};
