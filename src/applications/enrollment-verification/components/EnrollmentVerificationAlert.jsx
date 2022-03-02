import React from 'react';
import { PAYMENT_STATUS } from '../actions';
import {
  afterLastDayOfMonth,
  ENROLLMENT_VERIFICATION_TYPE,
  formatNumericalDate,
} from '../helpers';
import VerifyYourEnrollments from './VerifyYourEnrollments';

const successAlert = nextEnrollmentMonth => (
  <va-alert status="success" visible>
    You’re up-to-date with your monthly enrollment verification. You’ll be able
    to verify your enrollment next month on {nextEnrollmentMonth}.
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
    <VerifyYourEnrollments />
  </va-alert>
);

const pausedAlert = (
  <va-alert status="error" visible>
    <h3 slot="headline">We’ve paused your monthly education payments</h3>
    <p>
      We had to pause your payments because you haven’t verified your
      enrollment(s) for <strong>three months in a row</strong>. Please review
      and verify your monthly enrollment(s) to get the payments you’re entitled
      to.
    </p>
    <VerifyYourEnrollments />
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

function monthlyPaymentsPaused(unverifiedMonths) {
  if (unverifiedMonths.length < 3) {
    return false;
  }
  if (unverifiedMonths.length > 3) {
    return true;
  }

  const latestUnverifiedMonth = unverifiedMonths.reduce(
    (prev, current) => (prev.month > current.month ? prev : current),
  );

  return afterLastDayOfMonth(latestUnverifiedMonth.month);
}

function getEnrollmentVerificationAlert(status) {
  if (status?.paymentStatus === PAYMENT_STATUS.SCO_PAUSED) {
    return pausedScoAlert;
  }

  const unverifiedMonths = status?.months?.filter(month => !month.verified);

  if (!unverifiedMonths.length) {
    return successAlert(formatNumericalDate(status.nextVerificationDate));
  }

  return monthlyPaymentsPaused(unverifiedMonths) ? pausedAlert : warningAlert;
}

export const EnrollmentVerificationAlert = ({ status }) => {
  if (!status) {
    return <></>;
  }

  const alert = getEnrollmentVerificationAlert(status);
  return <>{alert}</>;
};

export default EnrollmentVerificationAlert;

EnrollmentVerificationAlert.propTypes = {
  status: ENROLLMENT_VERIFICATION_TYPE.isRequired,
};
