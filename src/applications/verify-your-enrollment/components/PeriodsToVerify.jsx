import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UpToDateVerificationStatement from './UpToDateVerificationStatement';
import VerifiedSuccessStatement from './VerifiedSuccessStatement';
import { getPeriodsToVerify } from '../helpers';
import Loader from './Loader';

const PeriodsToVerify = ({
  enrollmentData,
  loggedInEnenrollmentData,
  isUserLoggedIn,
  loading,
  link,
  toggleEnrollmentSuccess,
}) => {
  const userData = isUserLoggedIn ? loggedInEnenrollmentData : enrollmentData;
  const [userEnrollmentData, setUserEnrollmentData] = useState(userData);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const justVerified = !!toggleEnrollmentSuccess;

  useEffect(
    () => {
      setUserEnrollmentData(userData);
    },
    [userData],
  );

  useEffect(
    () => {
      if (
        userEnrollmentData?.['vye::UserInfo']?.awards &&
        userEnrollmentData?.['vye::UserInfo']?.pendingVerifications
      ) {
        const { awards, pendingVerifications } = userEnrollmentData?.[
          'vye::UserInfo'
        ];
        // add all previouslyVerified data into single array
        const { awardIds } = pendingVerifications;
        const toBeVerifiedEnrollmentsArray = [];
        awardIds.forEach(id => {
          // check for each id inside award_ids array
          if (awards.some(award => award.id === id)) {
            toBeVerifiedEnrollmentsArray.push(
              awards.find(award => award.id === id),
            );
          }
        });

        setPendingEnrollments(toBeVerifiedEnrollmentsArray);
      }
    },
    [userEnrollmentData],
  );

  return (
    <div id="verifications-pending-alert">
      {userEnrollmentData?.['vye::UserInfo']?.pendingVerifications?.awardIds
        .length > 0 && (
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
      {/* 
                will need to update logic here/ currently this would not work in prod
                as it would always show the verified success statement if there are no pending
                enrollments even if the user didn't just verify
            */}
      {userEnrollmentData?.['vye::UserInfo']?.pendingVerifications?.awardIds
        .length === 0 &&
        justVerified && (
          <div>
            <VerifiedSuccessStatement />
          </div>
        )}

      {loading ? (
        <Loader />
      ) : (
        userEnrollmentData?.['vye::UserInfo']?.pendingVerifications?.awardIds
          .length === 0 &&
        !justVerified && (
          <div className="vads-u-margin-top--2">
            <UpToDateVerificationStatement />
          </div>
        )
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  loggedInEnenrollmentData: state.personalInfo.personalInfo,
});

PeriodsToVerify.propTypes = {
  enrollmentData: PropTypes.object,
  isUserLoggedIn: PropTypes.bool,
  link: PropTypes.func,
  loading: PropTypes.bool,
  loggedInEnenrollmentData: PropTypes.object,
  toggleEnrollmentSuccess: PropTypes.bool,
};
export default connect(mapStateToProps)(PeriodsToVerify);
