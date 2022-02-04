import React from 'react';
import { useDispatch } from 'react-redux';
import {
  EDIT_MONTH_VERIFICATION,
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
} from '../actions';

import EnrollmentVerificationMonthInfo from './EnrollmentVerificationMonthInfo';

const correctText = (
  <p>
    <i className="fa fa-check-circle vads-u-color--green" /> You verified that
    this month’s enrollment information is correct
  </p>
);
const incorrectText = (
  <p>
    <i className="fas fa-exclamation-triangle" /> You verified that this month’s
    enrollment information isn’t correct
  </p>
);
const cantVerifyText = informationIncorrectMonth => {
  return (
    <p>
      <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />{' '}
      You can’t verify our enrollment for this month until your School
      Certifying Official corrects your information for{' '}
      {informationIncorrectMonth?.month}
    </p>
  );
};
const infoText = month => {
  <p>
    This is the enrollment information we have on file for you for {month.month}
    .
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

  const editVerification = () => {
    dispatch({
      type: EDIT_MONTH_VERIFICATION,
      month,
    });
  };

  const editVerificationLink = (
    <a href="#" onClick={editVerification}>
      Edit verification for {month.month}
    </a>
  );

  return (
    <div className="ev-highlighted-content-container">
      <header className="ev-highlighted-content-container_header">
        <h1 className="ev-highlighted-content-container_title vads-u-font-size--h3">
          {month.month}
        </h1>
      </header>
      <div className="ev-highlighted-content-container_content">
        {reviewPage ? reviewStatusText : infoText}

        <div className="ev-info-block">
          <EnrollmentVerificationMonthInfo enrollments={month.enrollments} />
        </div>

        {reviewPage && month.verificationStatus ? editVerificationLink : <></>}
      </div>
    </div>
  );
}
