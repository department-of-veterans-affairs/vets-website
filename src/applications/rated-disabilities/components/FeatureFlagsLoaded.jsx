import React from 'react';
import PropTypes from 'prop-types';

const loadingIndicator = (
  <div className="vads-u-margin-y--5">
    <va-loading-indicator
      data-testid="feature-flags-loading"
      message="Loading your information..."
      uswds="false"
    />
  </div>
);

export default function FeatureFlagsLoaded({ children, featureFlagsLoading }) {
  return !featureFlagsLoading ? children : loadingIndicator;
}

FeatureFlagsLoaded.propTypes = {
  children: PropTypes.node,
  featureFlagsLoading: PropTypes.bool,
};
