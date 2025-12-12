import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom-v5-compat';
import { connect } from 'react-redux';

import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { externalServices } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { DowntimeBanner } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import {
  initializeBrowserLogging,
  initializeRealUserMonitoring,
} from 'platform/monitoring/Datadog';

import AppContent from '../components/AppContent';
import { isLoadingFeatures } from '../selectors';
import {
  DATA_DOG_LOGGING_ID,
  DATA_DOG_LOGGING_SERVICE,
  DATA_DOG_LOGGING_TOGGLE,
  DATA_DOG_LOGGING_TOKEN,
  DATA_DOG_LOGGING_VERSION,
  DATA_DOG_RUM_ID,
  DATA_DOG_RUM_SERVICE,
  DATA_DOG_RUM_TOGGLE,
  DATA_DOG_RUM_TOKEN,
  DATA_DOG_RUM_VERSION,
} from '../utils/constants';

export function App({ featureFlagsLoading, user }) {
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const isLoadingFeatureFlags = useToggleLoadingValue();
  const isLoggingEnabled = useToggleValue(
    TOGGLE_NAMES[DATA_DOG_LOGGING_TOGGLE],
  );
  const isRUMEnabled = useToggleValue(TOGGLE_NAMES[DATA_DOG_RUM_TOGGLE]);

  useEffect(
    () => {
      if (isLoadingFeatureFlags) {
        return;
      }
      if (isLoggingEnabled) {
        initializeBrowserLogging({
          applicationId: DATA_DOG_LOGGING_ID,
          clientToken: DATA_DOG_LOGGING_TOKEN,
          service: DATA_DOG_LOGGING_SERVICE,
          version: DATA_DOG_LOGGING_VERSION,
        });
      }
    },
    [isLoggingEnabled, isLoadingFeatureFlags],
  );

  useEffect(
    () => {
      if (isLoadingFeatureFlags) {
        return;
      }
      if (isRUMEnabled) {
        initializeRealUserMonitoring({
          applicationId: DATA_DOG_RUM_ID,
          clientToken: DATA_DOG_RUM_TOKEN,
          service: DATA_DOG_RUM_SERVICE,
          version: DATA_DOG_RUM_VERSION,
        });
      } else {
        delete window.DD_RUM;
      }
    },
    [isRUMEnabled, isLoadingFeatureFlags],
  );

  return (
    <RequiredLoginView
      serviceRequired={backendServices.EVSS_CLAIMS}
      user={user}
      verify
    >
      <AppContent featureFlagsLoading={featureFlagsLoading}>
        <DowntimeBanner
          appTitle="Letters Generator"
          dependencies={[
            externalServices.evss,
            externalServices.lighthouseBenefitsClaims,
            externalServices.vaProfile,
            externalServices.global,
          ]}
        />
        <Outlet />
      </AppContent>
    </RequiredLoginView>
  );
}

App.propTypes = {
  featureFlagsLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  featureFlagsLoading: isLoadingFeatures(state),
  user: state.user,
});

export default connect(mapStateToProps)(App);
