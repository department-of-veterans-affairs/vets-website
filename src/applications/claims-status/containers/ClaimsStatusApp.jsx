import React, { useEffect, useState } from 'react';
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

const AppLoadingIndicator = ({ id }) => (
  <div className="loading-indicator-full-page-container">
    <va-loading-indicator
      data-testid={id}
      message="Loading your claims and appeals..."
      set-focus
    />
  </div>
);

AppLoadingIndicator.propTypes = {
  id: PropTypes.string,
};

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ featureFlagsLoading, isDataAvailable }) {
  const canUseApp =
    isDataAvailable === true || typeof isDataAvailable === 'undefined';
  const isAppReady = canUseApp && !featureFlagsLoading;

  if (!isAppReady) {
    return <AppLoadingIndicator id="feature-flags-loader" />;
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

// Simple toggle component for demo elements
const DemoToggle = () => {
  const [showDemos, setShowDemos] = useState(() => {
    const saved = localStorage.getItem('showAlertDemos');
    const shouldShow = saved === 'true';
    if (shouldShow) {
      document.body.classList.add('show-alert-demos');
    }
    return shouldShow;
  });

  const handleToggle = () => {
    const newValue = !showDemos;
    setShowDemos(newValue);
    localStorage.setItem('showAlertDemos', newValue);
    if (newValue) {
      document.body.classList.add('show-alert-demos');
    } else {
      document.body.classList.remove('show-alert-demos');
    }
  };

  return (
    <button className="alert-demo-toggle" onClick={handleToggle} type="button">
      {showDemos ? 'Hide' : 'Show'} Demos
    </button>
  );
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
    <>
      <DemoToggle />
      <RequiredLoginView
        loadingIndicator={
          <AppLoadingIndicator id="required-login-view-loader" />
        }
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
              externalServices.lighthouseBenefitsClaims,
              externalServices.global,
              externalServices.mvi,
              externalServices.vaProfile,
              externalServices.vbms,
            ]}
            loadingIndicator={
              <AppLoadingIndicator id="downtime-notification-loader" />
            }
          >
            <AppContent featureFlagsLoading={featureFlagsLoading} />
          </DowntimeNotification>
        </div>
      </RequiredLoginView>
    </>
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
