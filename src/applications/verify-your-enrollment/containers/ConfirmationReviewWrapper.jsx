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
import { getToggleEnrollmentErrorStatement } from '../selectors/getToggleEnrollmentErrorStatement';

import {
  updateToggleEnrollmentSuccess,
  updatePendingVerifications,
  updateVerifications,
  verifyEnrollmentAction,
} from '../actions';
import Loader from '../components/Loader';
import { useData } from '../hooks/useData';

const ConfirmationReviewWrapper = ({
  children,
  enrollmentData,
  loggedIEnenrollmentData,
  dispatchUpdateToggleEnrollmentSuccess,
  dispatchUpdatePendingVerifications,
  dispatchUpdateVerifications,
  dispatchVerifyEnrollmentAction,
  isUserLoggedIn,
}) => {
  useScrollToTop();
  const { loading } = useData();
  const history = useHistory();
  const [enrollmentPeriodsToVerify, setEnrollmentPeriodsToVerify] = useState(
    [],
  );
  const [currentPendingAwardIDs, setCurrentPendingAwardIDs] = useState([]);
  const enrollmentErrorStatementState = useSelector(
    getToggleEnrollmentErrorStatement,
  );
  const userData = isUserLoggedIn ? loggedIEnenrollmentData : enrollmentData;

  const handleBackClick = () => {
    history.push(VERIFICATION_REVIEW_RELATIVE_URL);
  };

  // used with mock data to mock what happens after
  // successfully verifying
  const handleVerification = () => {
    const currentDateTime = new Date().toISOString();
    // update awardIds to a blank array
    dispatchUpdatePendingVerifications({ awardIds: [] });
    const newVerifiedIDS = currentPendingAwardIDs?.map(id => {
      return {
        PendingVerificationSubmitted: currentDateTime,
        awardIds: [id],
      };
    });
    dispatchUpdateVerifications(newVerifiedIDS);
    dispatchVerifyEnrollmentAction();
  };

  const handleSubmission = () => {
    handleVerification();
    dispatchUpdateToggleEnrollmentSuccess(true);
    history.push(VERIFICATION_RELATIVE_URL);
  };

  useEffect(
    () => {
      if (
        userData?.['vye::UserInfo']?.awards &&
        userData?.['vye::UserInfo']?.pendingVerifications
      ) {
        const { awards, pendingVerifications } = userData?.['vye::UserInfo'];
        // add all previouslyVerified data into single array
        const { awardIds } = pendingVerifications;
        setCurrentPendingAwardIDs(awardIds);
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
                {!enrollmentErrorStatementState && <ErrorEnrollmentStatement />}
                <EnrollmentCard
                  enrollmentPeriods={enrollmentPeriodsToVerify}
                  confirmationPage
                  confirmedEnrollment={enrollmentErrorStatementState}
                />
                <div
                  style={{
                    paddingLeft: '8px',
                    marginTop: '24px',
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
              </>
            )}
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
  // enrollmentData: state.mockData.mockData,
  enrollmentData: state.getDataReducer.data,
});

const mapDispatchToProps = {
  dispatchUpdatePendingVerifications: updatePendingVerifications,
  dispatchUpdateToggleEnrollmentSuccess: updateToggleEnrollmentSuccess,
  dispatchUpdateVerifications: updateVerifications,
  dispatchVerifyEnrollmentAction: verifyEnrollmentAction,
};

ConfirmationReviewWrapper.propTypes = {
  dispatchUpdatePendingVerifications: PropTypes.func,
  dispatchUpdateToggleEnrollmentSuccess: PropTypes.func,
  dispatchUpdateVerifications: PropTypes.func,
  dispatchVerifyEnrollmentAction: PropTypes.func,
  children: PropTypes.any,
  enrollmentData: PropTypes.object,
  link: PropTypes.func,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationReviewWrapper);
