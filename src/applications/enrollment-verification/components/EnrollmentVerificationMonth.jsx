import React from 'react';

import { PAYMENT_STATUS } from '../actions';
import EnrollmentVerificationMonthInfo from './EnrollmentVerificationMonthInfo';

const verifiedMonthStatusMessage = (
  <>
    <i className="fa fa-check-circle vads-u-color--green" /> You verified this
    month
  </>
);
const notVerifiedMonthStatusMessage = (
  <>
    <p>
      <i className="fas fa-exclamation-triangle" /> You haven’t verified this
      month
    </p>
    <a
      className="vads-c-action-link--blue"
      href="/enrollment-history/verify-enrollments"
    >
      Verify your enrollments
    </a>
  </>
);
const needToVerifyMonthStatusMessage = (
  <>
    <p>
      <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />{' '}
      You need to verify this month
    </p>
    <a
      className="vads-c-action-link--blue"
      href="/enrollment-history/verify-enrollments"
    >
      Verify your enrollments
    </a>
  </>
);
const contactScoMonthStatusMessage = (
  <p>
    <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />{' '}
    Contact your School Certifying Official to update enrollment information
  </p>
);

function getMonthStatusMessage(month, paymentStatus) {
  if (month.verified) {
    return verifiedMonthStatusMessage;
  } else if (paymentStatus === PAYMENT_STATUS.ONGOING) {
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
      <h3>{month.month}</h3>
      {monthStatusMessage}

      <va-additional-info trigger="More information">
        <EnrollmentVerificationMonthInfo enrollments={month.enrollments} />
      </va-additional-info>
    </div>
  );
}
