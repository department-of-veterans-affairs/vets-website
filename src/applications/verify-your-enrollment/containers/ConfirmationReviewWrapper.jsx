import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import { useScrollToTop } from '../hooks/useScrollToTop';
import VerifyEnrollmentStatement from '../components/VerifyEnrollmentStatement';
import EnrollmentCard from '../components/Enrollmentcard';
import NeedHelp from '../components/NeedHelp';
import ErrorEnrollmentStatement from '../components/ErrorEnrollmentStatement';
import {
  VERIFICATION_REVIEW_RELATIVE_URL,
  VERIFICATION_RELATIVE_URL,
} from '../constants';
import { getEnrollmentCard } from '../selectors/enrollmentCard';
// import { getPeriodsToVerify } from '../helpers';
// import {
//     updatePendingVerifications,
//     updateVerifications,
//     verifyEnrollmentAction,
//   } from '../actions';
import Loader from '../components/Loader';
import { useData } from '../hooks/useData';

const ConfirmationReviewWrapper = ({
  children,
  enrollmentData,
  // dispatchUpdatePendingVerifications,
  // dispatchUpdateVerifications,
  // dispatchVerifyEnrollmentAction,
}) => {
  useScrollToTop();
  const { loading } = useData();
  const [enrollmentPeriodsToVerify, setEnrollmentPeriodsToVerify] = useState(
    [],
  );
  const history = useHistory();
  const enrollmentCardState = useSelector(getEnrollmentCard);

  const handleBackClick = () => {
    history.push(VERIFICATION_REVIEW_RELATIVE_URL);
  };

  const handleSubmission = () => {
    history.push(VERIFICATION_RELATIVE_URL);
  };

  useEffect(
    () => {
      if (
        enrollmentData?.['vye::UserInfo']?.awards &&
        enrollmentData?.['vye::UserInfo']?.pendingVerifications
      ) {
        const { awards, pendingVerifications } = enrollmentData?.[
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

        setEnrollmentPeriodsToVerify(toBeVerifiedEnrollmentsArray);
      }
    },
    [enrollmentData],
  );

  return (
    <>
      <div name="topScrollElement" />
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <EnrollmentVerificationBreadcrumbs />
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <VerifyEnrollmentStatement />
            {loading ? (
              <Loader />
            ) : (
              <>
                {enrollmentCardState && <ErrorEnrollmentStatement />}
                <EnrollmentCard
                  enrollmentPeriods={enrollmentPeriodsToVerify}
                  confirmationPage
                  confimredEnrollment={!enrollmentCardState}
                />
              </>
            )}
            <div
              style={{
                paddingLeft: '8px',
              }}
            >
              <va-button
                onClick={handleBackClick}
                back
                className="vye-button-override"
              />
              <va-button
                onClick={handleSubmission}
                text="Submit verification"
              />
            </div>
            {/* </div> */}
            {/* <div
                style={{
                    paddingLeft: '8px'
                }}
                >
                <VaButtonPair
                  continue
                  primaryLabel='Submit verification'
                  onPrimaryClick={function noRefCheck(){}}
                  onSecondaryClick={handleBackClick}
                />
            </div> */}
            <NeedHelp />
            {children}
          </div>
        </div>
        <va-back-to-top />
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  enrollmentData: state.mockData.mockData,
});

// const mapDispatchToProps = {
//   dispatchUpdatePendingVerifications: updatePendingVerifications,
//   dispatchUpdateVerifications: updateVerifications,
//   dispatchVerifyEnrollmentAction: verifyEnrollmentAction,
// };

ConfirmationReviewWrapper.propTypes = {
  // dispatchUpdatePendingVerifications: PropTypes.func,
  // dispatchUpdateVerifications: PropTypes.func,
  // dispatchVerifyEnrollmentAction: PropTypes.func,
  children: PropTypes.any,
  enrollmentData: PropTypes.object,
  link: PropTypes.func,
};
export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(ConfirmationReviewWrapper);
