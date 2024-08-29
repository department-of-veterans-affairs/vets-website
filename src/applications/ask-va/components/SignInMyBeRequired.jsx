import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const SignInMyBeRequired = ({ loggedIn }) => {
  // Render for users that are Unauthenticated
  return !loggedIn ? (
    <div className="vads-u-margin-bottom--3">
      <va-alert
        close-btn-aria-label="Close notification"
        status="continue"
        uswds
      >
        <h2 id="track-your-status-on-mobile" slot="headline">
          Sign in may be required
        </h2>
        <p className="vads-u-margin-y--0">
          If your question is about <b> yourself </b>
          or <b>someone else </b>
          you need to sign in.
        </p>
      </va-alert>
    </div>
  ) : null;
};

SignInMyBeRequired.propTypes = {
  loggedIn: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(SignInMyBeRequired);
