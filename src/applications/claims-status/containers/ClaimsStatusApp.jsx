import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import backendServices from 'platform/user/profile/constants/backendServices';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import environment from 'platform/utilities/environment';

import { setLastPage } from '../actions';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';
import VaButtonGroupSegmented from '../components/VaButtonGroupSegmented';
import { isLoadingFeatures } from '../selectors';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, featureFlagsLoading, isDataAvailable }) {
  const canUseApp =
    isDataAvailable === true || typeof isDataAvailable === 'undefined';
  const isAppReady = canUseApp && !featureFlagsLoading;
  const defaultFlipperOverride =
    sessionStorage.getItem('cstFlipperOverride') || 'featureToggle';
  const defaultShowFlipperOverrideState =
    sessionStorage.getItem('showFlipperOverride') === 'true' || false;
  const [selectedOption, setSelectedOption] = useState(defaultFlipperOverride);
  const [showFlipperOverride, setShowFlipperOverride] = useState(
    defaultShowFlipperOverrideState,
  );

  const buttons = [
    { label: 'EVSS', value: 'evss' },
    { label: 'Lighthouse', value: 'lighthouse' },
    { label: 'Feature toggle', value: 'featureToggle' },
  ];

  const canShowFlipperOverride = () => {
    const canShow = !environment.isProduction();
    const shouldShow = showFlipperOverride;
    return canShow && shouldShow;
  };

  const handleKeydown = event => {
    // `metaKey` is associated with the 'Command' key on macOS
    const ctrlPressed = event.ctrlKey || event.metaKey;

    if (ctrlPressed && event.shiftKey && event.key === 'k') {
      setShowFlipperOverride(prevState => {
        const nextState = !prevState;
        sessionStorage.setItem('showFlipperOverride', nextState);
        return nextState;
      });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const onOptionClick = option => {
    setSelectedOption(option);
    sessionStorage.setItem('cstFlipperOverride', option);
  };

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
      {isAppReady && (
        <>
          <div className="row">
            <div className="usa-width-two-thirds medium-8 columns" />
            {canShowFlipperOverride() && (
              <VaButtonGroupSegmented
                options={buttons}
                selected={selectedOption}
                onOptionClick={onOptionClick}
              />
            )}
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
      ]}
      user={user}
    >
      <AppContent featureFlagsLoading={featureFlagsLoading}>
        {children}
      </AppContent>
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
