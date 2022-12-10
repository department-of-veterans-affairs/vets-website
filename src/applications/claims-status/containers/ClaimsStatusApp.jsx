import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom-v5-compat';
import { useHistory } from 'react-router-dom';

import backendServices from 'platform/user/profile/constants/backendServices';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import { setLastPage } from '../actions';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
export function AppContent({ isDataAvailable }) {
  const canUseApp =
    isDataAvailable === true || typeof isDataAvailable === 'undefined';
  return (
    <div className="claims-status-content">
      {!canUseApp && <ClaimsAppealsUnavailable />}
      {canUseApp && <Outlet />}
    </div>
  );
}

export function ClaimsStatusApp({ dispatchSetLastPage, user }) {
  const history = useHistory();
  useEffect(() => {
    history.listen(location => {
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
      <AppContent />
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
)(ClaimsStatusApp);
