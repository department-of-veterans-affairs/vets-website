import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { useDatadogRum } from '../../shared/hooks/useDatadogRum';
import { medicationsUrls } from '../util/constants';

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
  const datadogRumConfig = {
    applicationId: '2b875bc2-034a-445b-868c-d43bec8928d1',
    clientToken: 'pubb9b9c833770797060110a821283a0892',
    site: 'ddog-gov.com',
    service: 'va.gov-mhv-medications',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 50,
    trackInteractions: true,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  };
  useDatadogRum(datadogRumConfig);

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

  if (
    !appEnabled &&
    window.location.pathname !== medicationsUrls.MEDICATIONS_ABOUT
  ) {
    window.location.replace(medicationsUrls.MEDICATIONS_ABOUT);
    return <></>;
  }

  return children;
};

App.propTypes = {
  children: PropTypes.object,
};

export default App;
