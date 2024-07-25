import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';

export function EnrollmentVerificationLogin({ toggleLoginModal }) {
  const onSignInClicked = useCallback(() => toggleLoginModal(true), [
    toggleLoginModal,
  ]);
  return (
    <va-alert status="continue" visible>
      <h3
        className="vads-u-font-size--h1 vads-u-font-weight--bold"
        slot="headline"
      >
        Sign in to verify your school enrollment
      </h3>
      <p>
        Sign in with your existing <strong>ID.me</strong> or{' '}
        <strong>Login.gov</strong> account. If you don’t have an account, you
        can create a free{' '}
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
      <va-button
        onClick={onSignInClicked}
        primary-alternate
        text="Sign in or create an account"
      />
    </va-alert>
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
