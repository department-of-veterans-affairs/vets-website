import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';

import { setLastPage } from '../actions';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const canUseApp =
    isDataAvailable === true || typeof isDataAvailable === 'undefined';
  return (
    <div className="claims-status-content">
      {!canUseApp && <ClaimsAppealsUnavailable />}
      {canUseApp && <>{children}</>}
    </div>
  );
}

function ClaimsStatusApp({ children, dispatchSetLastPage, router, user }) {
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
      <AppContent>{children}</AppContent>
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
  return { user: state.user };
}

const mapDispatchToProps = {
  dispatchSetLastPage: setLastPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ClaimsStatusApp));

export { ClaimsStatusApp, AppContent };
