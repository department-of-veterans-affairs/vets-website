// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signInServiceName } from '@department-of-veterans-affairs/platform-user/authentication/selectors';
import {
  isLoggedIn,
  isLOA3,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { MhvSimpleSigninCallToAction } from 'applications/static-pages/mhv-simple-signin-cta';

export const App = ({
  serviceName,
  userIsLoggedIn,
  userIsVerified,
  mhvAccountLoading,
  profileLoading,
}) => {
  return (
    <MhvSimpleSigninCallToAction
      headingLevel="3"
      serviceDescription="send secure messages"
      linkText="Go to your messages"
      linkUrl="/my-health/secure-messages/inbox"
      serviceName={serviceName}
      userIsLoggedIn={userIsLoggedIn}
      userIsVerified={userIsVerified}
      mhvAccountLoading={mhvAccountLoading}
      profileLoading={profileLoading}
    />
  );
};

App.propTypes = {
  mhvAccountLoading: PropTypes.bool,
  profileLoading: PropTypes.bool,
  serviceName: PropTypes.string,
  userIsLoggedIn: PropTypes.bool,
  userIsVerified: PropTypes.bool,
};

/**
 * Map state properties.
 * @param {Object} state the current state
 * @returns state properties
 */
export const mapStateToProps = state => {
  const { loading, mhvAccount } = selectProfile(state);
  return {
    serviceName: signInServiceName(state),
    userIsLoggedIn: isLoggedIn(state),
    userIsVerified: isLOA3(state),
    mhvAccountLoading: mhvAccount.loading,
    profileLoading: loading,
  };
};

export default connect(mapStateToProps)(App);
