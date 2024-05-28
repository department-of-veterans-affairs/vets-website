import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UpToDateVerificationStatement from './UpToDateVerificationStatement';
import VerifiedSuccessStatement from './VerifiedSuccessStatement';
import { getPeriodsToVerify } from '../helpers';
import Alert from './Alert';

const PeriodsToVerify = ({
  enrollmentData,
  // loggedInEnenrollmentData,
  link,
  toggleEnrollmentSuccess,
  verifyEnrollment,
}) => {
  // const userData = loggedInEnenrollmentData?.['vye::UserInfo'];
  // const [userEnrollmentData, setUserEnrollmentData] = useState(enrollmentData);

  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const justVerified = !!toggleEnrollmentSuccess;
  const { error } = verifyEnrollment;
  // useEffect(
  //   () => {
  //     setUserEnrollmentData(enrollmentData);
  //   },
  //   [enrollmentData],
  // );

  useEffect(
    () => {
      if (
        enrollmentData?.verifications &&
        enrollmentData?.pendingVerifications
      ) {
        const { pendingVerifications } = enrollmentData;
        // add all data to be verified into single array
        setPendingEnrollments(pendingVerifications);
      }
    },
    [enrollmentData],
  );

  return (
    <>
      {error && <Alert status="error" message="Oops Something went wrong" />}
      <div id="verifications-pending-alert">
        {enrollmentData?.pendingVerifications?.length > 0 && (
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h2
              id="vye-periods-to-verify-container"
              slot="headline"
              className="vads-u-font-size--h3
              vads-u-font-weight--bold"
            >
              You have enrollment periods to verify
            </h2>
            <div>
              {getPeriodsToVerify(pendingEnrollments)}
              {link && <>{link()}</>}
            </div>
          </va-alert>
        )}

        {enrollmentData?.pendingVerifications?.length === 0 &&
          justVerified && (
            <div>
              <VerifiedSuccessStatement />
            </div>
          )}
        {enrollmentData?.pendingVerifications?.length === 0 &&
          !justVerified && (
            <div className="vads-u-margin-top--2">
              <UpToDateVerificationStatement />
            </div>
          )}
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  // loggedInEnenrollmentData: state.personalInfo.personalInfo,
  verifyEnrollment: state.verifyEnrollment,
  // verificationsResponse: state.verificationsReducer.verificationsReducer,
});

PeriodsToVerify.propTypes = {
  link: PropTypes.func,
  loading: PropTypes.bool,
  // loggedInEnenrollmentData: PropTypes.object,
  toggleEnrollmentSuccess: PropTypes.bool,
  verifyEnrollment: PropTypes.object,
};
export default connect(mapStateToProps)(PeriodsToVerify);
