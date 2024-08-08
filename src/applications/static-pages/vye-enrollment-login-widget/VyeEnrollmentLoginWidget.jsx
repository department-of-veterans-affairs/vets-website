import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PropTypes from 'prop-types';

import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';

export const BASE_URL = '/education/verify-school-enrollment/';
export const REVIEW_ENROLLMENTS_URL_SEGMENT = 'mgib-enrollments';
export const REVIEW_ENROLLMENTS_URL = `${BASE_URL}${REVIEW_ENROLLMENTS_URL_SEGMENT}/`;
export const REVIEW_ENROLLMENTS_RELATIVE_URL = `/${REVIEW_ENROLLMENTS_URL_SEGMENT}/`;

export function VyeEnrollmentLoginWidget({
  toggleLoginModal,
  user,
  includedInFlipper,
}) {
  const onSignInClicked = useCallback(() => toggleLoginModal(true), [
    toggleLoginModal,
  ]);

  const visitorUI = (
    <div>
      <p>You can verify your enrollment online.</p>
      <va-alert
        close-btn-aria-label="Close notification"
        status="continue"
        visible
      >
        <h3 id="verify-your-mgib-enrollment" slot="headline">
          Sign in to verify your enrollment for MGIB benefits
        </h3>
        <p>
          Sign in with your existing <strong>ID.me</strong> or{' '}
          <strong>Login.gov</strong> account. If you don’t have either of these
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
        <va-button
          onClick={onSignInClicked}
          primary-alternate
          text="Sign in or create an account"
        />
      </va-alert>
    </div>
  );

  const loggedInUserUI = (
    <a className="vads-c-action-link--green" href={REVIEW_ENROLLMENTS_URL}>
      Verify your enrollment for MGIB benefits
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
      if (includedInFlipper === false) {
        return (
          <p>
            You can verify your enrollment by phone. Call
            <va-telephone contact="8884424551" />
            {' ('}
            <va-telephone contact="711" tty="true" />
            ). We’re here Monday through Friday, 8:00 a.m. to 7:00 p.m. ET.
          </p>
        );
      }
      if (includedInFlipper === true) {
        return loggedInUserUI;
      }
    }
    return visitorUI;
  };

  return renderUI();
}

const mapStateToProps = store => ({
  user: store.user || {},
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.vyeLoginWidget],
});
VyeEnrollmentLoginWidget.propTypes = {
  toggleLoginModal: PropTypes.func,
  user: PropTypes.object,
  includedInFlipper: PropTypes.bool,
};

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VyeEnrollmentLoginWidget);
