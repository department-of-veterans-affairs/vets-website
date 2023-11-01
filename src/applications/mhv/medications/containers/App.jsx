import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

const App = ({ children }) => {
  const { featureTogglesLoading, appEnabled } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        appEnabled:
          state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsToVaGovRelease],
      };
    },
    state => state.featureToggles,
  );

  if (featureTogglesLoading) {
    return (
      <div className="vads-l-grid-container">
        <va-loading-indicator
          message="Loading your medications..."
          setFocus
          data-testid="rx-feature-flag-loading-indicator"
        />
      </div>
    );
  }

  if (!appEnabled) {
    window.location.replace('/health-care/refill-track-prescriptions');
    return <></>;
  }

  return children;
};

App.propTypes = {
  children: PropTypes.object,
};

export default App;
