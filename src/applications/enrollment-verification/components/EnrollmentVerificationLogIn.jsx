import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

export function EnrollmentVerificationLogin({ toggleLoginModal }) {
  const onSignInClicked = useCallback(() => toggleLoginModal(true), [
    toggleLoginModal,
  ]);
  return (
    <va-alert status="continue" visible>
      <h3 slot="headline">
        Please sign in to verify your school enrollments for Post-9/11 GI Bill
      </h3>
      <p>
        Sign in with your existing <strong>ID.me</strong> account. If you don’t
        have an account, you can create a free <strong>ID.me</strong> account
        now.
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
