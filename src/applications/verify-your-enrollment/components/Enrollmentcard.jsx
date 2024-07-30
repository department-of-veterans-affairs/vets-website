/* eslint-disable no-lone-blocks */ // nested block is needed to display enrollment data correctly
import React from 'react';
import PropTypes from 'prop-types';
import {
  combineEnrollmentsWithStartMonth,
  translateDateIntoMonthYearFormat,
  getPeriodsToVerify,
} from '../helpers';

const EnrollmentCard = ({ enrollmentPeriods, confirmationPage = false }) => {
  const getCards = () => {
    const combinedEnrollmentsObj = combineEnrollmentsWithStartMonth(
      enrollmentPeriods,
    );
    const combinedEnrollmentsValues = Object.values(
      combinedEnrollmentsObj,
    ).reverse();

    // if there are more than one enrollment periods that startd in the same month
    // then the records are combined into the same array
    // if else is in place to take account for arrays that have multiple objects
    return combinedEnrollmentsValues.map((enrollment, index) => {
      if (enrollment.length > 1) {
        return (
          <div key={index}>
            <div className="vads-u-margin-top--3">
              <h2 className="vye-highlighted-title-container">
                {translateDateIntoMonthYearFormat(enrollment[0].actBegin)}
              </h2>
            </div>
            <div className="vye-highlighted-content-container">
              {!confirmationPage &&
                `This is the enrollment information we have on file for you for ${translateDateIntoMonthYearFormat(
                  enrollment[0].actBegin,
                )}.`}
              {enrollment.map(nestedEnrollment => {
                {
                  /* sending true as second argument turns on left border */
                }
                return getPeriodsToVerify([nestedEnrollment]);
              })}
            </div>
          </div>
        );
      }
      return (
        <div key={index}>
          <div className="vads-u-margin-top--3">
            <h2 className="vye-highlighted-title-container">
              {translateDateIntoMonthYearFormat(enrollment[0].actBegin)}
            </h2>
          </div>
          <div className="vye-highlighted-content-container">
            {!confirmationPage &&
              `This is the enrollment information we have on file for you for ${translateDateIntoMonthYearFormat(
                enrollment[0].actBegin,
              )}.`}
            {/* sending true as second argument turns on left border */}
            {getPeriodsToVerify(enrollment)}
          </div>
        </div>
      );
    });
  };

  return <div id="montgomery-gi-bill-enrollment-card">{getCards()}</div>;
};

EnrollmentCard.propTypes = {
  confirmationPage: PropTypes.bool,
  confirmedEnrollment: PropTypes.bool,
  enrollmentPeriods: PropTypes.array,
};

export default EnrollmentCard;
