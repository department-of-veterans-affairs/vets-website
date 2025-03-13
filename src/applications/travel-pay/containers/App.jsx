import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom-v5-compat';
import { connect } from 'react-redux';

import { isLOA3 } from 'platform/user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';

import VerifyIdentityAlert from '../components/alerts/VerifyIdentityAlert';
import { useDatadogRum } from '../util/useDatadogRum';

const App = ({ identityVerified, user }) => {
  useDatadogRum();
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
        <article className="usa-grid-full vads-u-padding-bottom--2">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-y--4">
            <VerifyIdentityAlert />
          </div>
        </article>
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
