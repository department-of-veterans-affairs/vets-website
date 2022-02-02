import React from 'react';
import { connect } from 'react-redux';

import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';

export const EnrollmentVerificationIntroPage = ({
  loggedIn,
  toggleLoginModal,
}) => {
  return (
    <>
      <EnrollmentVerificationPageWrapper>
        <h1>Verify your school enrollments</h1>
        <p className="va-introtext">
          If you have education benefits, verify your enrollments each month to
          continue getting paid.
        </p>

        <h2>For Post-9/11 GI Bill&reg; benefits</h2>
        <p>
          If you get a monthly housing allowance (MHA) or kicker payments (or
          both) under the Post-9/11 GI Bill (Chapter 33), you’ll need to verify
          your enrollments each month. If you don’t verify your enrollment for
          more than two months, we will pause your monthly education payments.
        </p>

        {loggedIn ? (
          <a
            type="button"
            className="usa-button-primary va-button-primary"
            href="review-enrollments"
          >
            Verify your enrollments for Post-9/11 GI Bill
          </a>
        ) : (
          <va-alert status="continue" visible>
            <h3 slot="headline">
              Please sign in to verify your school enrollments for Post-9/11 GI
              Bill
            </h3>
            <p>
              Sign in with your existing <strong>ID.me</strong> account. If you
              don’t have an account, you can create a free{' '}
              <strong>ID.me</strong> account now.
            </p>
            <button
              type="button"
              className="usa-button-primary va-button-primary"
              onClick={() => toggleLoginModal(true)}
            >
              Sign in or create an account
            </button>
          </va-alert>
        )}

        <h2>For Montgomery GI Bill and other education benefits</h2>
        <p>
          <strong>
            Follow these instructions if you are currently using the
          </strong>
          :
        </p>
        <ul>
          <li>
            Montgomery GI Bill - Active Duty (MGIB-AD, Chapter 30),{' '}
            <strong>or</strong>
          </li>
          <li>
            Montgomery GI Bill - Selected Reserve (MGIB-SR, Chapter 1606),{' '}
            <strong>or</strong>
          </li>
          <li>Veterans Rapid Retraining Assistance Program (VRRAP)</li>
        </ul>
        <p>
          You will need to verify your enrollments each month using the Web
          Automated Verification of Enrollment (WAVE).
        </p>
        <a
          className="vads-c-action-link--green"
          href="https://www.gibill.va.gov/wave/index.do"
        >
          Verify your enrollments using WAVE
        </a>
      </EnrollmentVerificationPageWrapper>
    </>
  );
};

const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn || false,
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnrollmentVerificationIntroPage);
