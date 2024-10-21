import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';

import { setLastPage } from '../actions';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';
import { isLoadingFeatures } from '../selectors';
import { useBrowserMonitoring } from '../utils/datadog-rum/useBrowserMonitoring';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ featureFlagsLoading, isDataAvailable }) {
  const canUseApp =
    isDataAvailable === true || typeof isDataAvailable === 'undefined';
  const isAppReady = canUseApp && !featureFlagsLoading;

  if (!isAppReady) {
    return (
      <div className="vads-u-margin-y--5">
        <va-loading-indicator
          data-testid="feature-flags-loading"
          message="Loading your information..."
        />
      </div>
    );
  }

  return (
    <div className="claims-status-content">
      {!canUseApp && <ClaimsAppealsUnavailable />}
      {isAppReady && <Outlet />}
    </div>
  );
}

AppContent.propTypes = {
  children: PropTypes.node,
  featureFlagsLoading: PropTypes.bool,
  isDataAvailable: PropTypes.bool,
};

function ClaimsStatusApp({
  dispatchSetLastPage,
  featureFlagsLoading,
  user,
  loggedIn,
}) {
  const { pathname } = useLocation();
  useEffect(() => {
    return () => {
      dispatchSetLastPage(pathname);
    };
  });

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring({
    loggedIn,
    version: '1.0.0',
    applicationId: '75bb17aa-34f0-4366-b196-eb11eda75425',
    clientToken: 'pub21bfd23fdfb656231f24906ea91ccb01',
    service: 'benefits-claim-status-tool',
  });

  return (
    <RequiredLoginView
      verify
      serviceRequired={[
        backendServices.EVSS_CLAIMS,
        backendServices.APPEALS_STATUS,
        backendServices.LIGHTHOUSE,
      ]}
      user={user}
    >
      <div id="downtime-app">
        <DowntimeNotification
          appTitle="Claim Status"
          dependencies={[
            externalServices.evss,
            externalServices.global,
            externalServices.mvi,
            externalServices.vaProfile,
            externalServices.vbms,
          ]}
        >
          <AppContent featureFlagsLoading={featureFlagsLoading} />
        </DowntimeNotification>
      </div>
    </RequiredLoginView>
  );
}

ClaimsStatusApp.propTypes = {
  dispatchSetLastPage: PropTypes.func,
  featureFlagsLoading: PropTypes.bool,
  loggedIn: PropTypes.bool,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  const featureFlagsLoading = isLoadingFeatures(state);

  return {
    featureFlagsLoading,
    loggedIn: isLoggedIn(state),
    user: state.user,
  };
}

const mapDispatchToProps = {
  dispatchSetLastPage: setLastPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimsStatusApp);

export { AppContent, ClaimsStatusApp };
