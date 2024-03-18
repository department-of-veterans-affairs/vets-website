/* eslint-disable no-lone-blocks */ // nested block is needed to display enrollment data correctly
import React from 'react';
import PropTypes from 'prop-types';
import {
  combineEnrollmentsWithEndMonths,
  translateDateIntoMonthYearFormat,
  getPeriodsToVerify,
} from '../helpers';

const EnrollmentCard = ({
  enrollmentPeriods,
  confirmationPage = false,
  confirmedEnrollment = false,
}) => {
  const getCards = () => {
    const combinedEnrollmentsObj = combineEnrollmentsWithEndMonths(
      enrollmentPeriods,
    );
    const combinedEnrollmentsValues = Object.values(
      combinedEnrollmentsObj,
    ).reverse();

    // if there are more than one enrollment periods that ends in the same month
    // then the records are combined into the same array
    // if else is in place to take account for arrays that have multiple objects
    return combinedEnrollmentsValues.map(enrollment => {
      if (enrollment.length > 1) {
        return (
          <div key={enrollment[0].id}>
            <div className="vads-u-margin-top--3">
              <h2 className="vye-highlighted-title-container">
                {translateDateIntoMonthYearFormat(enrollment[0].awardBeginDate)}
              </h2>
            </div>
            <div className="vye-highlighted-content-container">
              {!confirmationPage &&
                `This is the enrollment information we have on file for you for ${translateDateIntoMonthYearFormat(
                  enrollment[0].awardBeginDate,
                )}.`}
              {confirmationPage &&
                confirmedEnrollment && (
                  <>
                    <i
                      className="fas fa-check-circle vads-u-color--green "
                      aria-hidden="true"
                    />{' '}
                    You are verifying that this month’s enrollment information
                    is correct
                  </>
                )}
              {enrollment.map(nestedEnrollment => {
                {
                  /* sending true as second argument turns on left border */
                }
                return getPeriodsToVerify([nestedEnrollment], true);
              })}
            </div>
          </div>
        );
      }
      return (
        <div key={enrollment[0].id}>
          <div className="vads-u-margin-top--3">
            <h2 className="vye-highlighted-title-container">
              {translateDateIntoMonthYearFormat(enrollment[0].awardBeginDate)}
            </h2>
          </div>
          <div className="vye-highlighted-content-container">
            {!confirmationPage &&
              `This is the enrollment information we have on file for you for ${translateDateIntoMonthYearFormat(
                enrollment[0].awardBeginDate,
              )}.`}
            {confirmationPage &&
              confirmedEnrollment && (
                <>
                  <i
                    className="fas fa-check-circle vads-u-color--green "
                    aria-hidden="true"
                  />{' '}
                  You are verifying that this month’s enrollment information is
                  correct
                </>
              )}
            {/* sending true as second argument turns on left border */}
            {getPeriodsToVerify(enrollment, true)}
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
