import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';

export function EnrollmentVerificationLogin({ toggleLoginModal, user }) {
  const onSignInClicked = useCallback(() => toggleLoginModal(true), [
    toggleLoginModal,
  ]);

  const redirectToEnrollmentVerification = () => {
    window.location.href = '/education/verify-school-enrollment/';
  };

  const VisitorUI = (
    <va-alert status="continue" visible>
      <h1
        className="vads-u-font-size--h1 vads-u-font-weight--bold"
        slot="headline"
      >
        Sign in to verify your school enrollment
      </h1>
      <p>
        Sign in with your existing <strong>ID.me</strong> or{' '}
        <strong>Login.gov</strong> account. If you don’t have any of these
        accounts, you can create a free{' '}
        <a
          className="vads-u-font-weight--bold"
          href="https://www.id.me/"
          target="_blank"
          rel="noreferrer"
        >
          ID.me
        </a>{' '}
        account or{' '}
        <a
          className="vads-u-font-weight--bold"
          href="https://secure.login.gov/"
          target="_blank"
          rel="noreferrer"
        >
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
  );

  const LoggedInUserUI = (
    <button
      className="va-button-primary"
      type="button"
      onClick={redirectToEnrollmentVerification}
    >
      Verify your enrollments for Post-9/11 GI Bill
    </button>
  );

  const Spinner = (
    <div className="vads-u-margin-y--5">
      <va-loading-indicator
        label="Loading"
        message="Please wait while we load the application for you."
        set-focus
      />
    </div>
  );

  const renderLoginUI = () => {
    if (!user?.login?.currentlyLoggedIn && !user?.login?.hasCheckedKeepAlive) {
      return Spinner;
    }
    if (user?.login?.currentlyLoggedIn) {
      return LoggedInUserUI;
    }

    return VisitorUI;
  };

  return renderLoginUI();
}

const mapStateToProps = state => ({
  user: state.user || {},
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnrollmentVerificationLogin);

EnrollmentVerificationLogin.propTypes = {
  toggleLoginModal: PropTypes.func,
  user: PropTypes.object,
};
