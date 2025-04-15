import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';

export const BASE_URL = '/education/verify-school-enrollment/';
export const REVIEW_ENROLLMENTS_URL_SEGMENT = 'enrollment-verifications';
export const REVIEW_ENROLLMENTS_URL = `${BASE_URL}${REVIEW_ENROLLMENTS_URL_SEGMENT}/`;
export const REVIEW_ENROLLMENTS_RELATIVE_URL = `/${REVIEW_ENROLLMENTS_URL_SEGMENT}/`;

export function EnrollmentVerificationLogin({ toggleLoginModal, user }) {
  const onSignInClicked = useCallback(() => toggleLoginModal(true), [
    toggleLoginModal,
  ]);

  const visitorUI = (
    <va-alert-sign-in variant="signInRequired" visible heading-level={3}>
      <span slot="SignInButton">
        <va-button
          onClick={onSignInClicked}
          text="Sign in or create an account"
        />
      </span>
    </va-alert-sign-in>
  );

  const loggedInUserUI = (
    <a className="vads-c-action-link--green" href={REVIEW_ENROLLMENTS_URL}>
      Verify your enrollments for Post-9/11 GI Bill
    </a>
  );

  const spinner = (
    <div className="vads-u-margin-y--5">
      <va-loading-indicator
        label="Loading"
        message="Please wait while we load the application for you."
      />
    </div>
  );

  const renderUI = () => {
    if (!user?.login?.currentlyLoggedIn && !user?.login?.hasCheckedKeepAlive) {
      return spinner;
    }
    if (user?.login?.currentlyLoggedIn) {
      return loggedInUserUI;
    }

    return visitorUI;
  };

  return renderUI();
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
