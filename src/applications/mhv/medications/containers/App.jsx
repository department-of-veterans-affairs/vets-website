import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { useDatadogRum } from '../../shared/hooks/useDatadogRum';
import { medicationsUrls } from '../util/constants';

const App = ({ children }) => {
  const user = useSelector(selectUser);
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
          message="Loading..."
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

  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.USER_PROFILE]}
    >
      <DowntimeNotification
        appTitle="Medications"
        dependencies={[externalServices.mhvPlatform, externalServices.mhvMeds]}
      >
        {children}
      </DowntimeNotification>
    </RequiredLoginView>
  );
};

App.propTypes = {
  children: PropTypes.node,
};

export default App;
