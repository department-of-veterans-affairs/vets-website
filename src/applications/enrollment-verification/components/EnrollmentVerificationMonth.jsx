import React from 'react';
import PropTypes from 'prop-types';

import { PAYMENT_STATUS } from '../actions';
import EnrollmentVerificationMonthInfo from './EnrollmentVerificationMonthInfo';
import VerifyYourEnrollments from './VerifyYourEnrollments';
import { formatReadableMonthYear, MONTH_PROP_TYPE } from '../helpers';

const verifiedMonthStatusMessage = (
  <p className="ev-enrollment-month_message">
    <i
      className="fa fa-check-circle vads-u-color--green vads-u-margin-right--1"
      aria-hidden="true"
    />{' '}
    You verified this month
  </p>
);
const notVerifiedMonthStatusMessage = (
  <>
    <p className="ev-enrollment-month_message">
      <i
        className="fas fa-exclamation-triangle vads-u-margin-right--1"
        aria-hidden="true"
      />{' '}
      You haven’t verified this month
    </p>
    <VerifyYourEnrollments />
  </>
);
const needToVerifyMonthStatusMessage = (
  <>
    <p className="ev-enrollment-month_message">
      <i
        className="fas fa-exclamation-circle vads-u-color--secondary-dark vads-u-margin-right--1"
        aria-hidden="true"
      />{' '}
      You need to verify this month
    </p>
    <VerifyYourEnrollments />
  </>
);
const contactScoMonthStatusMessage = (
  <p className="ev-enrollment-month_message">
    <i
      className="fas fa-exclamation-circle vads-u-color--secondary-dark vads-u-margin-right--1"
      aria-hidden="true"
    />{' '}
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

EnrollmentVerificationMonth.propTypes = {
  month: MONTH_PROP_TYPE.isRequired,
  paymentStatus: PropTypes.oneOf([
    PAYMENT_STATUS.ONGOING,
    PAYMENT_STATUS.PAUSED,
    PAYMENT_STATUS.SCO_PAUSED,
  ]),
};
