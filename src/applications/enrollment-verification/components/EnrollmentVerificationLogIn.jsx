import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';

export function EnrollmentVerificationLogin({ toggleLoginModal }) {
  const onSignInClicked = useCallback(() => toggleLoginModal(true), [
    toggleLoginModal,
  ]);
  return (
    <va-alert-sign-in variant="signInRequired" visible heading-level={3}>
      <span slot="SignInButton">
        <va-button
          onClick={onSignInClicked}
          text="Sign in or create an account"
        />
      </span>
    </va-alert-sign-in>
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
