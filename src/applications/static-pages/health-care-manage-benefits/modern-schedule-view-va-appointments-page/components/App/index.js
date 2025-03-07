// Node modules.
import React from 'react';
import { connect } from 'react-redux';
import { signInServiceName } from '@department-of-veterans-affairs/platform-user/authentication/selectors';
import {
  isLoggedIn,
  isLOA3,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import PropTypes from 'prop-types';
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
      serviceDescription="view, schedule, or cancel your appointment online"
      linkText="Go to your appointments"
      linkUrl="/my-health/appointments"
      serviceName={serviceName}
      userIsLoggedIn={userIsLoggedIn}
      userIsVerified={userIsVerified}
      mhvAccountLoading={mhvAccountLoading}
      profileLoading={profileLoading}
    />
  );
};
App.displayName = 'ModernScheduleAppointmentsWidget';

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
