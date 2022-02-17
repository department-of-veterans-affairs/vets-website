/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  EDIT_MONTH_VERIFICATION,
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
} from '../actions';
import { formatReadableMonthYear } from '../helpers';

import EnrollmentVerificationMonthInfo from './EnrollmentVerificationMonthInfo';

const correctText = (
  <p>
    <i className="fa fa-check-circle vads-u-color--green" aria-hidden="true" />{' '}
    You verified that this month’s enrollment information is correct
  </p>
);
const incorrectText = (
  <p>
    <i className="fas fa-exclamation-triangle" aria-hidden="true" /> You
    verified that this month’s enrollment information isn’t correct
  </p>
);
const cantVerifyText = informationIncorrectMonth => {
  return (
    <p>
      <i
        className="fas fa-exclamation-circle vads-u-color--secondary-dark"
        aria-hidden="true"
      />{' '}
      You can’t verify our enrollment for this month until your School
      Certifying Official corrects your information for{' '}
      {informationIncorrectMonth?.month}
    </p>
  );
};
const infoText = month => {
  <p>
    This is the enrollment information we have on file for you for {month}.
  </p>;
};

export default function MonthReviewCard({
  month,
  informationIncorrectMonth,
  reviewPage = false,
}) {
  const dispatch = useDispatch();

  let reviewStatusText;
  if (month.verificationStatus === VERIFICATION_STATUS_CORRECT) {
    reviewStatusText = correctText;
  } else if (month.verificationStatus === VERIFICATION_STATUS_INCORRECT) {
    reviewStatusText = incorrectText;
  } else if (informationIncorrectMonth) {
    reviewStatusText = cantVerifyText(informationIncorrectMonth);
  }

  function editVerification() {
    dispatch({
      type: EDIT_MONTH_VERIFICATION,
      month,
    });
  }

  const editVerificationLink = (
    <button
      className="usa-button-secondary"
      // eslint-disable-next-line react/jsx-no-bind
      onClick={editVerification}
      type="button"
    >
      Edit verification for {month.month}
    </button>
  );

  return (
    <div className="ev-highlighted-content-container">
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
