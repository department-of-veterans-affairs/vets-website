import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom-v5-compat';
import { connect } from 'react-redux';

import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { externalServices } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { DowntimeBanner } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import AppContent from '../components/AppContent';
import { isLoadingFeatures } from '../selectors';

export function App({ featureFlagsLoading, user, loggedIn }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(TOGGLE_NAMES.lettersClientSideMonitoring);

  // Need to figure out how to conditionally RUM dashboard, get error on eslint, the built in filtering
  // might not be enough, but we need this enabled all the time for logs. So many two monitors? One for
  // logs and one for RUM?
  useBrowserMonitoring({
    loggedIn,
    version: '1.0.0',
    applicationId: '',
    clientToken: '',
    service: 'benefits-letters-and-documents-tool',
  });

  if (toggleValue) {
    // This is temporary, just testing feature flag.
  }

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
