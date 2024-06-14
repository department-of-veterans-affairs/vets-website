import React from 'react';
import PropTypes from 'prop-types';

const LoginRequiredAlert = ({ handleLogin }) => (
  <va-alert status="error" data-testid="hca-idform-login-alert" uswds>
    <h2 slot="headline">Please sign in to review your information</h2>
    <p>
      We’re sorry for the interruption, but we’ve found some more information
      that we need you to review before you can apply for VA health care. Please
      sign in to VA.gov to review. If you don’t have an account, you can create
      one now.
    </p>
    <va-button onClick={handleLogin} text="Sign in to VA.gov" uswds />
  </va-alert>
);

LoginRequiredAlert.propTypes = {
  handleLogin: PropTypes.func,
};

export default LoginRequiredAlert;
