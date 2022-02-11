import React from 'react';
import { PAYMENT_STATUS } from '../actions';

const verifyEnrollmentsActionLink = (
  <a
    className="vads-c-action-link--blue"
    href="/enrollment-history/verify-enrollments"
  >
    Verify your enrollments
  </a>
);

const successAlert = (
  <va-alert status="success" visible>
    You’re up-to-date with your monthly enrollment verification. You’ll be able
    to verify your enrollment next month on [Month Day Year].
  </va-alert>
);
const warningAlert = (
  <va-alert status="warning" visible>
    <h3 slot="headline">
      We’re missing one or more of your enrollment verifications
    </h3>
    <p>
      You’ll need to verify your monthly enrollments to get your scheduled
      payments.
    </p>
    {verifyEnrollmentsActionLink}
  </va-alert>
);

const pausedAlert = (
  <va-alert status="error" visible>
    <h3 slot="headline">We’ve paused your monthly education payments</h3>
    <p>
      We had to pause your payments because you haven’t verified your
      enrollment(s) for two months in a row. Please review and verify your
      monthly enrollment(s) to get the payments you’re entitled to.
    </p>
    {verifyEnrollmentsActionLink}
  </va-alert>
);

const pausedScoAlert = (
  <va-alert status="error" visible>
    <h3 slot="headline">
      We’ve paused your monthly education payments until you update your
      enrollment information
    </h3>
    <p>
      You’ve verified that your monthly enrollment has changed or isn’t correct,
      but you haven’t updated it yet.
    </p>
    <p>
      To continue getting your monthly education payments, you’ll need to work
      with your School Certifying Official (SCO) to update your information on
      file.
    </p>
    <p>
      We encourage you to reach out to your SCO as soon as you can to avoid an
      overpayment. If we overpay you, you may have a debt to pay back.
    </p>
  </va-alert>
);

function getEnrollmentVerificationAlert(status) {
  const anyUnverifiedMonths = status?.months?.some(month => !month.verified);

  if (status?.paymentStatus === PAYMENT_STATUS.ONGOING) {
    return anyUnverifiedMonths ? warningAlert : successAlert;
  }

  return status?.paymentStatus === PAYMENT_STATUS.PAUSED
    ? pausedAlert
    : pausedScoAlert;
}

export default function EnrollmentVerificationAlert({ status }) {
  if (!status) {
    return <></>;
  }

  const alert = getEnrollmentVerificationAlert(status);
  return <>{alert}</>;
}
