import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import {
  getPeriodsToVerify2,
  isVerificationEndDateValid,
  translateDateIntoMonthYearFormat,
} from '../helpers';

const DGIBEnrollmentCard = ({
  enrollmentVerifications,
  confirmationPage = false,
}) => {
  //   console.log(enrollmentVerifications, 'enrollmentVerifications')
  const getCards = () => {
    const sortedEnrollments = enrollmentVerifications?.sort((a, b) => {
      return (
        new Date(a.verificationBeginDate) - new Date(b.verificationBeginDate)
      );
    });
    return sortedEnrollments?.map((enrollment, index) => {
      const myUUID = uuidv4();
      return (
        <div key={`Enrollment-to-be-verified-${myUUID}`}>
          {isVerificationEndDateValid(enrollment.verificationEndDate) &&
            !enrollment.verificationMethod && (
              <div>
                <div className="vads-u-margin-top--3">
                  <h2 className="vye-highlighted-title-container">
                    {translateDateIntoMonthYearFormat(
                      enrollment?.verificationBeginDate,
                    )}
                  </h2>
                </div>
                <div className="vye-highlighted-content-container">
                  {!confirmationPage &&
                    `This is the enrollment information we have on file for you for ${translateDateIntoMonthYearFormat(
                      enrollment?.verificationBeginDate,
                    )}.`}
                  <div key={`period-${index}`}>
                    {getPeriodsToVerify2(enrollmentVerifications)[index]}
                  </div>
                </div>
              </div>
            )}
        </div>
      );
    });
  };
  return <div>{getCards()}</div>;
};
DGIBEnrollmentCard.propTypes = {
  confirmationPage: PropTypes.bool,
  enrollmentVerifications: PropTypes.array,
};
export default DGIBEnrollmentCard;
