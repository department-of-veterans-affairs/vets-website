import React from 'react';

import { PAYMENT_STATUS } from '../actions';
import EnrollmentVerificationMonthInfo from './EnrollmentVerificationMonthInfo';
import VerifyYourEnrollments from './VerifyYourEnrollments';
import { formatReadableMonthYear } from '../helpers';

const verifiedMonthStatusMessage = (
  <p className="ev-enrollment-month_message">
    <i className="fa fa-check-circle vads-u-color--green" /> You verified this
    month
  </p>
);
const notVerifiedMonthStatusMessage = (
  <>
    <p className="ev-enrollment-month_message">
      <i className="fas fa-exclamation-triangle" /> You haven’t verified this
      month
    </p>
    <VerifyYourEnrollments />
  </>
);
const needToVerifyMonthStatusMessage = (
  <>
    <p className="ev-enrollment-month_message">
      <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />{' '}
      You need to verify this month
    </p>
    <VerifyYourEnrollments />
  </>
);
const contactScoMonthStatusMessage = (
  <p className="ev-enrollment-month_message">
    <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />{' '}
    Contact your School Certifying Official to update enrollment information
  </p>
);

function getMonthStatusMessage(month, paymentStatus) {
  if (month.verified) {
    return verifiedMonthStatusMessage;
  }
  if (paymentStatus === PAYMENT_STATUS.ONGOING) {
    return notVerifiedMonthStatusMessage;
  }

  return paymentStatus === PAYMENT_STATUS.PAUSED
    ? needToVerifyMonthStatusMessage
    : contactScoMonthStatusMessage;
}

export default function EnrollmentVerificationMonth({ month, paymentStatus }) {
  const monthStatusMessage = getMonthStatusMessage(month, paymentStatus);

  return (
    <div className="ev-enrollment-month">
      <h4>{formatReadableMonthYear(month.month)}</h4>
      {monthStatusMessage}

      <va-additional-info trigger="More information">
        <EnrollmentVerificationMonthInfo enrollments={month.enrollments} />
      </va-additional-info>
    </div>
  );
}
