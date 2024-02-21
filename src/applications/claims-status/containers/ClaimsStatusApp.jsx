import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { setLastPage } from '../actions';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';
import VaButtonGroupSegmented from '../components/VaButtonGroupSegmented';
import { isLoadingFeatures } from '../selectors';

const flipperOverrideModes = [
  { label: 'EVSS', value: 'evss' },
  { label: 'Lighthouse', value: 'lighthouse' },
  { label: 'Feature toggle', value: 'featureToggle' },
];

const shouldShowFlipperOverride = showFlipperOverride => {
  const canShow = !environment.isProduction();
  const shouldShow = showFlipperOverride;
  return canShow && shouldShow;
};

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, featureFlagsLoading, isDataAvailable }) {
  const canUseApp =
    isDataAvailable === true || typeof isDataAvailable === 'undefined';
  const isAppReady = canUseApp && !featureFlagsLoading;

  // Mode to use when overriding feature toggle
  // Options are: evss, lighthouse, featureToggle
  const defaultFlipperOverrideMode =
    sessionStorage.getItem('cstFlipperOverrideMode') || 'featureToggle';
  const [flipperOverrideMode, setFlipperOverrideMode] = useState(
    defaultFlipperOverrideMode,
  );

  // Whether flipper override controls should be shown or not
  // Can be toggled with key combination: Ctrl + Shift + k
  const defaultShowFlipperOverrideState =
    sessionStorage.getItem('showFlipperOverride') === 'true' || false;
  const [showFlipperOverride, setShowFlipperOverride] = useState(
    defaultShowFlipperOverrideState,
  );

  useEffect(() => {
    const handleKeydown = event => {
      // `metaKey` is associated with the 'Command' key on macOS
      const ctrlPressed = event.ctrlKey || event.metaKey;

      if (ctrlPressed && event.shiftKey && event.key.toLowerCase() === 'k') {
        setShowFlipperOverride(prevState => {
          const nextState = !prevState;
          sessionStorage.setItem('showFlipperOverride', nextState);
          return nextState;
        });
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const onOptionClick = option => {
    setFlipperOverrideMode(option);
    sessionStorage.setItem('cstFlipperOverrideMode', option);
  };

  if (!isAppReady) {
    return (
      <div className="vads-u-margin-y--5">
        <va-loading-indicator
          data-testid="feature-flags-loading"
          message="Loading your information..."
          uswds="false"
        />
      </div>
    );
  }

  const showFlipperOverrideControls = shouldShowFlipperOverride(
    showFlipperOverride,
  );

  return (
    <div className="claims-status-content">
      {!canUseApp && <ClaimsAppealsUnavailable />}
      {isAppReady && (
        <>
          <div className="row">
            <div className="usa-width-two-thirds medium-8 columns">
              {showFlipperOverrideControls && (
                <VaButtonGroupSegmented
                  options={flipperOverrideModes}
                  selected={flipperOverrideMode}
                  onOptionClick={onOptionClick}
                />
              )}
            </div>
          </div>
          {children}
        </>
      )}
    </div>
  );
}

AppContent.propTypes = {
  children: PropTypes.node,
  featureFlagsLoading: PropTypes.bool,
  isDataAvailable: PropTypes.bool,
};

function ClaimsStatusApp({
  children,
  dispatchSetLastPage,
  featureFlagsLoading,
  router,
  user,
}) {
  useEffect(() => {
    router.listen(location => {
      dispatchSetLastPage(location.pathname);
    });
  }, []);

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
          <AppContent featureFlagsLoading={featureFlagsLoading}>
            {children}
          </AppContent>
        </DowntimeNotification>
      </div>
    </RequiredLoginView>
  );
}

ClaimsStatusApp.propTypes = {
  children: PropTypes.object,
  dispatchSetLastPage: PropTypes.func,
  featureFlagsLoading: PropTypes.bool,
  router: PropTypes.object,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  const featureFlagsLoading = isLoadingFeatures(state);

  return {
    featureFlagsLoading,
    user: state.user,
  };
}

const mapDispatchToProps = {
  dispatchSetLastPage: setLastPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ClaimsStatusApp));

export { ClaimsStatusApp, AppContent };
