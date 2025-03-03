// Node modules.
import React from 'react';
import { connect } from 'react-redux';
import { signInServiceName } from '@department-of-veterans-affairs/platform-user/authentication/selectors';
import {
  isLoggedIn,
  isLOA3,
} from '@department-of-veterans-affairs/platform-user/selectors';
import PropTypes from 'prop-types';
import { MhvSimpleSigninCallToAction } from 'applications/static-pages/mhv-simple-signin-cta';

export const App = ({ serviceName, userIsLoggedIn, userIsVerified }) => {
  return (
    <MhvSimpleSigninCallToAction
      headingLevel="3"
      serviceDescription="view, schedule, or cancel your appointment online"
      linkText="Go to your appointments"
      linkUrl="/my-health/appointments"
      serviceName={serviceName}
      userIsLoggedIn={userIsLoggedIn}
      userIsVerified={userIsVerified}
    />
  );
};
App.displayName = 'ModernScheduleAppointmentsWidget';

App.propTypes = {
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
  return {
    serviceName: signInServiceName(state),
    userIsLoggedIn: isLoggedIn(state),
    userIsVerified: isLOA3(state),
  };
};

export default connect(mapStateToProps)(App);
