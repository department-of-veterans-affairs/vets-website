/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import { useScrollToTop } from '../hooks/useScrollToTop';
import VerifyEnrollmentStatement from '../components/VerifyEnrollmentStatement';
import EnrollmentCard from '../components/Enrollmentcard';
import NeedHelp from '../components/NeedHelp';
import { VERIFICATION_RELATIVE_URL } from '../constants';
import Loader from '../components/Loader';
import { useData } from '../hooks/useData';
import {
  updateToggleEnrollmentSuccess,
  updatePendingVerifications,
  updateVerifications,
  verifyEnrollmentAction,
} from '../actions';

const VerificationReviewWrapper = ({
  children,
  enrollmentData,
  // loggedIEnenrollmentData,
  dispatchUpdateToggleEnrollmentSuccess,
  dispatchUpdatePendingVerifications,
  dispatchUpdateVerifications,
  dispatchVerifyEnrollmentAction,
  // isUserLoggedIn,
  // dispatchupdateToggleEnrollmentCard,
}) => {
  useScrollToTop();
  const [radioValue, setRadioValue] = useState(false);
  const [errorStatement, setErrorStatement] = useState(null);
  const { loading } = useData();
  const [enrollmentPeriodsToVerify, setEnrollmentPeriodsToVerify] = useState(
    [],
  );
  const [currentPendingAwardIDs, setCurrentPendingAwardIDs] = useState([]);
  // const userData = isUserLoggedIn ? loggedIEnenrollmentData : enrollmentData;
  const history = useHistory();

  const handleBackClick = () => {
    history.push(VERIFICATION_RELATIVE_URL);
  };
  const handleRadioClick = e => {
    const { value } = e.detail;
    setRadioValue(value);
    setErrorStatement(null);
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
        enrollmentData?.['vye::UserInfo']?.awards &&
        enrollmentData?.['vye::UserInfo']?.pendingVerifications
      ) {
        const { awards, pendingVerifications } = enrollmentData?.[
          'vye::UserInfo'
        ];
        // add all previouslyVerified data into single array
        const { awardIds } = pendingVerifications;
        const toBeVerifiedEnrollmentsArray = [];
        setCurrentPendingAwardIDs(awardIds);
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

  useEffect(
    () => {
      const element = document.querySelector('va-radio');
      if (element && errorStatement != null) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [errorStatement],
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
                <EnrollmentCard enrollmentPeriods={enrollmentPeriodsToVerify} />
                <div className="vye-max-width-480px">
                  <p className="vads-u-margin-top--3">
                    <span className="vads-u-font-weight--bold">
                      If the above enrollment information isn’t correct,
                    </span>{' '}
                    please do not submit the form. Instead, work with your
                    School Certifying Official (SCO) to ensure your enrollment
                    information is updated with the VA before submitting this
                    form.
                  </p>
                  <p className="vads-u-margin-top--3">
                    <span className="vads-u-font-weight--bold">Note:</span>{' '}
                    Please note that providing false reports concerning your
                    benefits may result in a fine, imprisonment or both.
                  </p>
                </div>
                <div className="vads-u-margin-top--3">
                  <VaRadio
                    error={errorStatement}
                    hint=""
                    label="To the best of your knowledge, is this enrollment
                          information correct?"
                    required
                    onVaValueChange={handleRadioClick}
                  >
                    <VaRadioOption
                      id="vye-radio-button-yes"
                      label="Yes, this information is correct."
                      name="vye-radio-group1"
                      tile
                      value="true"
                    />
                  </VaRadio>
                </div>
                <div
                  style={{
                    paddingLeft: '8px',
                    marginTop: '24px',
                    display: 'flex',
                    columnGap: '10px',
                  }}
                >
                  <va-button onClick={handleBackClick} back uswds />
                  {radioValue && (
                    <va-button
                      onClick={handleSubmission}
                      text="Submit"
                      submit
                      uswds
                    />
                  )}
                  {!radioValue && (
                    <va-button
                      onClick={handleSubmission}
                      text="Submit"
                      disabled
                      uswds
                    />
                  )}
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
  enrollmentData: state.mockData.mockData,
});

const mapDispatchToProps = {
  dispatchUpdatePendingVerifications: updatePendingVerifications,
  dispatchUpdateToggleEnrollmentSuccess: updateToggleEnrollmentSuccess,
  dispatchUpdateVerifications: updateVerifications,
  dispatchVerifyEnrollmentAction: verifyEnrollmentAction,
};

VerificationReviewWrapper.propTypes = {
  children: PropTypes.any,
  dispatchUpdatePendingVerifications: PropTypes.func,
  dispatchUpdateToggleEnrollmentSuccess: PropTypes.func,
  dispatchUpdateVerifications: PropTypes.func,
  dispatchVerifyEnrollmentAction: PropTypes.func,
  enrollmentData: PropTypes.object,
  isUserLoggedIn: PropTypes.bool,
  link: PropTypes.func,
  loggedIEnenrollmentData: PropTypes.object,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerificationReviewWrapper);
