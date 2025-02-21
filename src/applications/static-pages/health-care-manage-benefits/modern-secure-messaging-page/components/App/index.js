// Node modules.
import React from 'react';
import { connect } from 'react-redux';
import {
  isLoggedIn,
  isLOA3,
} from '@department-of-veterans-affairs/platform-user/selectors';

// Relative imports.
import { MhvSimpleSigninCallToAction } from 'applications/static-pages/mhv-simple-signin-cta';

export const App = state => {
  return (
    <MhvSimpleSigninCallToAction
      headingLevel="3"
      serviceDescription="send secure messages"
      linkText="Go to your messages"
      linkUrl="/my-health/secure-messages/inbox"
      userIsLoggedIn={state.userIsLoggedIn}
      userIsVerified={state.userIsVerified}
    />
  );
};

/**
 * Map state properties.
 * @param {Object} state the current state
 * @returns state properties
 */
export const mapStateToProps = state => {
  return {
    userIsLoggedIn: isLoggedIn(state),
    userIsVerified: isLOA3(state),
  };
};

export default connect(mapStateToProps)(App);
