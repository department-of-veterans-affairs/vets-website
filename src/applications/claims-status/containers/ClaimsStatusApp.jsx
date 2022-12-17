import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import backendServices from 'platform/user/profile/constants/backendServices';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import { setLastPage } from '../actions';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';

import { isLoadingFeatures } from '../selectors';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable, featureFlagsLoading }) {
  const canUseApp =
    isDataAvailable === true || typeof isDataAvailable === 'undefined';
  const shouldUseApp = canUseApp && !featureFlagsLoading;

  return (
    <div className="claims-status-content">
      {!canUseApp && <ClaimsAppealsUnavailable />}
      {shouldUseApp && <>{children}</>}
    </div>
  );
}

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
