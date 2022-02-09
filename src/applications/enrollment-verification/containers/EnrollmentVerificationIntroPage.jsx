/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchPost911GiBillEligibility } from '../actions';

import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import EnrollmentVerificationLogin from '../components/EnrollmentVerificationLogIn';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';

const verifyEnrollmentsButton = (
  <a
    type="button"
    className="usa-button-primary va-button-primary"
    href="review-enrollments"
  >
    Verify your enrollments for Post-9/11 GI Bill
  </a>
);

const noPost911GiBillAlert = (
  <va-alert status="info" visible>
    <h3 slot="headline">
      You do not have an active Post-9/11 GI Bill education benefit
    </h3>
    <div>
      If you think this is a mistake, please call the Education Call Center at{' '}
      <a href="tel:888-442-4551">888-442-4551</a>. We’re here Monday through
      Friday, 8:00 a.m. to 7:00 p.m. ET.
    </div>
  </va-alert>
);

export function EnrollmentVerificationIntroPage({
  loggedIn,
  hascheckedkeepalive,
  getPost911GiBillEligibility,
  post911GiBillEligibility,
}) {
  useEffect(
    () => {
      if (post911GiBillEligibility === undefined) {
        getPost911GiBillEligibility();
      }
    },
    [getPost911GiBillEligibility, post911GiBillEligibility],
  );

  if (!loggedIn && !hascheckedkeepalive) {
    return <EnrollmentVerificationLoadingIndicator />;
  }

  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Verify your school enrollments</h1>
      <p className="va-introtext">
        If you have education benefits, verify your enrollments each month to
        continue getting paid.
      </p>

      <h2>
        For Post-9/11 GI Bill
        <sup>&reg;</sup> benefits
      </h2>
      <p>
        If you get a monthly housing allowance (MHA) or kicker payments (or
        both) under the Post-9/11 GI Bill (Chapter 33), you’ll need to verify
        your enrollments each month. If you don’t verify your enrollment for
        more than two months, we will pause your monthly education payments.
      </p>

      {!loggedIn ? <EnrollmentVerificationLogin /> : <></>}
      {loggedIn && post911GiBillEligibility ? verifyEnrollmentsButton : <></>}
      {loggedIn && !post911GiBillEligibility ? noPost911GiBillAlert : <></>}

      <h2>For Montgomery GI Bill benefits:</h2>
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
        <li>Montgomery GI Bill - Selected Reserve (MGIB-SR, Chapter 1606)</li>
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

      <h2>For other education benefits:</h2>

      <p>
        <strong>
          Follow these instructions if you are currently using the:
        </strong>
      </p>
      <ul>
        <li>
          Veteran Employment Through Technology Education Courses (VET TEC)
          program
        </li>
      </ul>
      <p>
        You will need to verify your enrollments by{' '}
        <a href="mailto:&#086;&#069;&#084;&#084;&#069;&#067;&#046;&#086;&#066;&#065;&#066;&#085;&#070;&#064;&#118;&#097;&#046;&#103;&#111;&#118;?subject=Verify your VET TEC enrollments">
          emailing our VET TEC team.
        </a>
      </p>

      <p>
        <strong>
          Follow these instructions if you are currently using the:
        </strong>
      </p>
      <ul>
        <li>
          Edith Nourse Rogers Science Technology Engineering Math (STEM)
          Scholarship
        </li>
      </ul>
      <p>
        You will need to verify your enrollments by text message or by{' '}
        <a href="mailto:&#083;&#084;&#069;&#077;&#046;&#086;&#066;&#065;&#066;&#085;&#070;&#064;&#086;&#065;&#046;&#103;&#111;&#118;?subject=Verify your STEM enrollments">
          emailing our STEM team
        </a>
        . Verifying by text instead of email can help you get your housing
        payments faster.{' '}
      </p>
      <p>
        If you receive the Rogers STEM Scholarship, we’ll send an opt-in text
        message to your primary phone number. We’ll send you a text message each
        month asking if you attended your STEM courses.{' '}
        <a href="https://youtu.be/diBCc8lQcis">
          Go to our STEMText video (YouTube)
        </a>{' '}
        to learn more.
      </p>
      <p>
        <strong>Note</strong>: If you need to update your primary phone number,
        call us at{' '}
        <a href="tel:+1-888-442-4551" aria-label="8 8 8. 4 4 2. 4 5 5 1.">
          888-442-4551
        </a>
        . We’re here Monday through Friday, 8:00 a.m. to 7:00 p.m. ET. If you
        have hearing loss, call{' '}
        <a href="tel:711" aria-label="TTY. 7 1 1.">
          TTY: 711
        </a>
        .
      </p>
    </EnrollmentVerificationPageWrapper>
  );
}

const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn,
  hascheckedkeepalive: state?.user?.login?.hasCheckedKeepAlive,
  post911GiBillEligibility: state?.data?.post911GiBillEligibility,
  verificationStatus: state?.data?.verificationStatus,
});

const mapDispatchToProps = {
  getPost911GiBillEligibility: fetchPost911GiBillEligibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnrollmentVerificationIntroPage);
