import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';

import environment from 'platform/utilities/environment';
import { setLastPage } from '../actions';
import ServiceUnavailableAlert from '../components/ServiceUnavailableAlert';
import { isLoadingFeatures } from '../selectors';

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
      {!canUseApp && (
        <ServiceUnavailableAlert
          services={['claims', 'appeals']}
          headerLevel={1}
        />
      )}
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
    toggleName: 'cstUseDataDogRUM',
    applicationId: '75bb17aa-34f0-4366-b196-eb11eda75425',
    clientToken: 'pub21bfd23fdfb656231f24906ea91ccb01',
    service: 'benefits-claim-status-tool',
    version: process.env.APP_VERSION || '1.0.0',
    sessionReplaySampleRate:
      environment.vspEnvironment() === 'staging' ? 100 : 50,
    // Prevent PII (file names) from being sent to Datadog in click event metadata
    beforeSend: event => {
      if (event.action?.type === 'click') {
        // eslint-disable-next-line no-param-reassign
        event.action.target.name = 'Clicked sensitive item';
      }
      return true;
    },
  });

  return (
    <RequiredLoginView
      loadingIndicator={<AppLoadingIndicator id="required-login-view-loader" />}
      verify
      serviceRequired={[
        backendServices.APPEALS_STATUS,
        backendServices.LIGHTHOUSE,
      ]}
      user={user}
    >
      <div id="downtime-app">
        <DowntimeNotification
          appTitle="Claim Status"
          dependencies={[
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
