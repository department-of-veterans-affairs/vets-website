import PropTypes from 'prop-types';
import React from 'react';

import EnrollmentVerificationMonthInfo from './EnrollmentVerificationMonthInfo';
import VerifyYourEnrollments from './VerifyYourEnrollments';
import { STATUS } from '../constants';
import { MONTH_PROP_TYPE, STATUS_PROP_TYPE } from '../helpers';

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
    <strong>
      Contact your School Certifying Official to update enrollment information
    </strong>
  </p>
);

function getMonthStatusMessage(month, status, lastCertifiedThroughDate) {
  if (month.certifiedEndDate <= lastCertifiedThroughDate) {
    return verifiedMonthStatusMessage;
  }

  switch (status) {
    case STATUS.MISSING_VERIFICATION:
      return notVerifiedMonthStatusMessage;
    case STATUS.PAYMENT_PAUSED:
      return needToVerifyMonthStatusMessage;
    case STATUS.SCO_PAUSED:
      return contactScoMonthStatusMessage;
    default:
      return <></>;
  }
}

export default function EnrollmentVerificationMonth({
  lastCertifiedThroughDate,
  month,
  status,
}) {
  const monthStatusMessage = getMonthStatusMessage(
    month,
    status,
    lastCertifiedThroughDate,
  );

  return (
    <div className="ev-enrollment-month vads-u-margin-y--3">
      <h1 className="vads-u-font-size--h4 vads-u-font-weight--bold vads-u-margin-top--3">
        {month.verificationMonth}
      </h1>
      {monthStatusMessage}

      <va-additional-info
        trigger={`More information for ${month.verificationMonth}`}
      >
        <EnrollmentVerificationMonthInfo month={month} />
      </va-additional-info>
    </div>
  );
}

EnrollmentVerificationMonth.propTypes = {
  lastCertifiedThroughDate: PropTypes.string.isRequired,
  month: MONTH_PROP_TYPE.isRequired,
  status: STATUS_PROP_TYPE.isRequired,
};
