import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UpToDateVerificationStatement from './UpToDateVerificationStatement';
import VerifiedSuccessStatement from './VerifiedSuccessStatement';
// import {
//   updatePendingVerifications,
//   updateVerifications,
//   verifyEnrollmentAction,
// } from '../actions';
import { getPeriodsToVerify } from '../helpers';

const PeriodsToVerify = ({
  enrollmentData,
  // dispatchUpdatePendingVerifications,
  // dispatchUpdateVerifications,
  // dispatchVerifyEnrollmentAction,
  link,
}) => {
  const [userEnrollmentData, setUserEnrollmentData] = useState(enrollmentData);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  // const [currentPendingAwardIDs, setCurrentPendingAwardIDs] = useState([]);

  useEffect(
    () => {
      setUserEnrollmentData(enrollmentData);
    },
    [enrollmentData],
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
        // setCurrentPendingAwardIDs(awardIds);
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
          // class="vads-u-margin-bottom--4"
          status="info"
          visible
        >
          <div
            slot="headline"
            className="vads-u-font-size--h2 vads-u-font-weight--bold"
          >
            You have enrollment periods to verify
          </div>
          <div>
            {getPeriodsToVerify(pendingEnrollments)}
            {/* <va-button
              onClick={handleVerification}
              text="Start enrollment verification"
              data-testid="Verify enrollment"
            /> */}
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
        .length === 0 && (
        <div>
          <VerifiedSuccessStatement />
        </div>
      )}
      {userEnrollmentData?.['vye::UserInfo']?.pendingVerifications?.awardIds
        .length === undefined && (
        <div className="vads-u-margin-top--2">
          <UpToDateVerificationStatement />
        </div>
      )}
    </div>
  );
};

// export default PeriodsToVerify
const mapStateToProps = state => ({
  enrollmentData: state.mockData.mockData,
});

// const mapDispatchToProps = {
//   dispatchUpdatePendingVerifications: updatePendingVerifications,
//   dispatchUpdateVerifications: updateVerifications,
//   dispatchVerifyEnrollmentAction: verifyEnrollmentAction,
// };

PeriodsToVerify.propTypes = {
  // dispatchUpdatePendingVerifications: PropTypes.func,
  // dispatchUpdateVerifications: PropTypes.func,
  // dispatchVerifyEnrollmentAction: PropTypes.func,
  enrollmentData: PropTypes.object,
  link: PropTypes.func,
};
export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(PeriodsToVerify);
