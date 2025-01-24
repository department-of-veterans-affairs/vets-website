import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom-v5-compat';
import { connect } from 'react-redux';

import { isLOA3 } from 'platform/user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';

const App = ({ identityVerified, user }) => {
  return (
    <RequiredLoginView
      serviceRequired={[backendServices.USER_PROFILE]}
      user={user}
    >
      {identityVerified ? (
        <>
          <MhvSecondaryNav />
          <Outlet />
        </>
      ) : (
        // TODO: incorporate VerifyIdentityAlert from access error PR
        <p>You must verify your identity</p>
      )}
    </RequiredLoginView>
  );
};

App.propTypes = {
  identityVerified: PropTypes.bool,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    identityVerified: isLOA3(state),
    user: state.user,
  };
}

export default connect(mapStateToProps)(App);
