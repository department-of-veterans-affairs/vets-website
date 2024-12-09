import React from 'react';
import PropTypes from 'prop-types';
import {
  combineEnrollmentsWithStartMonthDGIB,
  getPeriodsToVerifyDGIB,
  isVerificationEndDateValid,
  sortedEnrollmentsDGIB,
  translateDateIntoMonthYearFormat,
} from '../helpers';

const DGIBEnrollmentCard = ({
  enrollmentVerifications,
  confirmationPage = false,
}) => {
  const getCards = () => {
    const combinedEnrollmentsObj = combineEnrollmentsWithStartMonthDGIB(
      sortedEnrollmentsDGIB(enrollmentVerifications),
    );
    const combinedEnrollmentsValues =
      combinedEnrollmentsObj && typeof combinedEnrollmentsObj === 'object'
        ? Object.values(combinedEnrollmentsObj).reverse()
        : [];
    return combinedEnrollmentsValues.map((enrollment, index) => {
      if (enrollment.length > 1) {
        return (
          <div key={index}>
            <div>
              <div className="vads-u-margin-top--3">
                <h2 className="vye-highlighted-title-container">
                  {translateDateIntoMonthYearFormat(
                    enrollment[0].verificationEndDate,
                  )}
                </h2>
              </div>
              <div className="vye-highlighted-content-container">
                {!confirmationPage &&
                  `This is the enrollment information we have on file for you for ${translateDateIntoMonthYearFormat(
                    enrollment[0].verificationEndDate,
                  )}.`}
                {enrollment.map(nestedEnrollment => {
                  return getPeriodsToVerifyDGIB([nestedEnrollment]);
                })}
              </div>
            </div>
          </div>
        );
      }
      return (
        <div key={index}>
          {isVerificationEndDateValid(enrollment[0].verificationEndDate) &&
            !enrollment[0].verificationMethod && (
              <>
                <div className="vads-u-margin-top--3">
                  <h2 className="vye-highlighted-title-container">
                    {translateDateIntoMonthYearFormat(
                      enrollment[0].verificationEndDate,
                    )}
                  </h2>
                </div>
                <div className="vye-highlighted-content-container">
                  {!confirmationPage &&
                    `This is the enrollment information we have on file for you for ${translateDateIntoMonthYearFormat(
                      enrollment[0].verificationEndDate,
                    )}.`}
                  {getPeriodsToVerifyDGIB(enrollment)}
                </div>
              </>
            )}
        </div>
      );
    });
  };
  return <div id="montgomery-gi-bill-enrollment-card">{getCards()}</div>;
};
DGIBEnrollmentCard.propTypes = {
  confirmationPage: PropTypes.bool,
  enrollmentVerifications: PropTypes.array,
};
export default DGIBEnrollmentCard;
