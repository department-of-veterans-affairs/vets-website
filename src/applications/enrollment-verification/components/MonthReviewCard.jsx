import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
} from '../actions';
import { VERIFY_ENROLLMENTS_URL } from '../constants';
import { formatReadableMonthYear, MONTH_PROP_TYPE } from '../helpers';

import EnrollmentVerificationMonthInfo from './EnrollmentVerificationMonthInfo';

const correctText = (
  <p className="vads-u-margin-bottom--3">
    <i
      className="fa fa-check-circle vads-u-color--green vads-u-margin-right--1"
      aria-hidden="true"
    />{' '}
    You verified that this month’s enrollment information is correct
  </p>
);

const incorrectText = (
  <p className="vads-u-margin-bottom--3">
    <i
      className="fas fa-exclamation-circle vads-u-color--secondary-dark vads-u-margin-right--1"
      aria-hidden="true"
    />{' '}
    You verified that this month’s enrollment information is incorrect
  </p>
);

const cantVerifyText = informationIncorrectMonth => {
  return (
    <p className="vads-u-margin-bottom--3">
      <i
        className="fas fa-exclamation-triangle vads-u-margin-right--1"
        aria-hidden="true"
      />{' '}
      You can’t verify our enrollment for this month until your School
      Certifying Official corrects your information for{' '}
      {formatReadableMonthYear(informationIncorrectMonth?.month)}
    </p>
  );
};

const infoText = month => {
  return (
    <p className="vads-u-margin-bottom--3">
      This is the enrollment information we have on file for you for{' '}
      {formatReadableMonthYear(month)}.
    </p>
  );
};

export default function MonthReviewCard({
  month,
  informationIncorrectMonth,
  onEditMonth,
  reviewPage = false,
}) {
  let reviewStatusText;
  if (month.verificationStatus === VERIFICATION_STATUS_CORRECT) {
    reviewStatusText = correctText;
  } else if (month.verificationStatus === VERIFICATION_STATUS_INCORRECT) {
    reviewStatusText = incorrectText;
  } else if (informationIncorrectMonth) {
    reviewStatusText = cantVerifyText(informationIncorrectMonth);
  }

  const editMonthVerification = useCallback(
    event => {
      event.preventDefault();
      onEditMonth(month);
    },
    [month, onEditMonth],
  );

  const editVerificationLink = (
    <a href={VERIFY_ENROLLMENTS_URL} onClick={editMonthVerification}>
      Edit verification for {formatReadableMonthYear(month.month)}
    </a>
  );

  return (
    <div className="ev-highlighted-content-container vads-u-margin-top--1">
      <header className="ev-highlighted-content-container_header">
        <h1 className="ev-highlighted-content-container_title vads-u-font-size--h3">
          {formatReadableMonthYear(month.month)}
        </h1>
      </header>
      <div className="ev-highlighted-content-container_content">
        {reviewPage ? reviewStatusText : infoText(month.month)}

        <div className="ev-info-block">
          <EnrollmentVerificationMonthInfo enrollments={month.enrollments} />
        </div>

        {reviewPage && month.verificationStatus ? editVerificationLink : <></>}
      </div>
    </div>
  );
}

MonthReviewCard.propTypes = {
  month: MONTH_PROP_TYPE.isRequired,
  informationIncorrectMonth: MONTH_PROP_TYPE,
  reviewPage: PropTypes.string,
  onEditMonth: PropTypes.func,
};
