import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CallToActionWidget from 'applications/static-pages/cta-widget';

import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

export function EnrollmentVerificationLogin({ toggleLoginModal }) {
  const onSignInClicked = useCallback(() => toggleLoginModal(true), [
    toggleLoginModal,
  ]);
  return (
    <CallToActionWidget appId="enrollment-verification">
      <va-alert status="continue" visible>
        <h1
          className="vads-u-font-size--h1 vads-u-font-weight--bold"
          slot="headline"
        >
          Please sign in to verify your enrollment
        </h1>
        <p>
          Sign in with your existing <strong>ID.me</strong> or{' '}
          <strong>Login.gov</strong> account. If you don’t have an account, you
          can create a free{' '}
          <a href="https://api.id.me/" target="_blank" rel="noreferrer">
            ID.me
          </a>{' '}
          account or{' '}
          <a href="https://secure.login.gov/" target="_blank" rel="noreferrer">
            Login.gov
          </a>{' '}
          account now.
        </p>
        <button
          type="button"
          className="usa-button-primary va-button-primary"
          onClick={onSignInClicked}
        >
          Sign in or create an account
        </button>
      </va-alert>
    </CallToActionWidget>
  );
}

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  null,
  mapDispatchToProps,
)(EnrollmentVerificationLogin);

EnrollmentVerificationLogin.propTypes = {
  toggleLoginModal: PropTypes.func,
};
