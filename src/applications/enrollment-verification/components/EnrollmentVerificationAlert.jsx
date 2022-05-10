import React from 'react';
import { STATUS } from '../constants';
import VerifyYourEnrollments from './VerifyYourEnrollments';
import { STATUS_PROP_TYPE } from '../helpers';

const successAlert /* nextEnrollmentMonth => */ = (
  <va-alert status="success" visible>
    You’re up-to-date with your monthly enrollment verification. You’ll be able
    to verify your enrollment next month
    {/* on {nextEnrollmentMonth} */}.
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
      enrollment(s) for <strong>two months in a row</strong>. Please review and
      verify your monthly enrollment(s) to get the payments you’re entitled to.
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

const EnrollmentVerificationAlert = ({ status }) => {
  switch (status) {
    case STATUS.ALL_VERIFIED:
      return successAlert;
    case STATUS.MISSING_VERIFICATION:
      return warningAlert;
    case STATUS.PAYMENT_PAUSED:
      return pausedAlert;
    case STATUS.SCO_PAUSED:
      return pausedScoAlert;
    default:
      return <></>;
  }
};

EnrollmentVerificationAlert.propTypes = {
  status: STATUS_PROP_TYPE.isRequired,
};

export default EnrollmentVerificationAlert;
