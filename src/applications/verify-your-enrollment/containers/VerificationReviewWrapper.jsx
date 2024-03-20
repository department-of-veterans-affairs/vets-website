/* eslint-disable no-unused-expressions */

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import { useScrollToTop } from '../hooks/useScrollToTop';
import VerifyEnrollmentStatement from '../components/VerifyEnrollmentStatement';
import EnrollmentCard from '../components/Enrollmentcard';
import NeedHelp from '../components/NeedHelp';
import {
  VERIFICATION_RELATIVE_URL,
  CONFIRMATION_REVIEW_RELATIVE_URL,
} from '../constants';
import { updateToggleEnrollmentCard } from '../actions';
import Loader from '../components/Loader';
import { useData } from '../hooks/useData';

const VerificationReviewWrapper = ({
  children,
  enrollmentData,
  dispatchupdateToggleEnrollmentCard,
}) => {
  useScrollToTop();
  const [radioValue, setRadioValue] = useState(null);
  const [errorStatement, setErrorStatement] = useState(null);
  const { loading } = useData();
  const [enrollmentPeriodsToVerify, setEnrollmentPeriodsToVerify] = useState(
    [],
  );
  const history = useHistory();

  const handleBackClick = () => {
    history.push(VERIFICATION_RELATIVE_URL);
  };

  const handleNextClick = () => {
    if (radioValue === null) {
      setErrorStatement('Please provide a response');
    } else {
      history.push(CONFIRMATION_REVIEW_RELATIVE_URL);
    }
  };

  const handleRadioClick = e => {
    const { value } = e.detail;
    setRadioValue(value);
    setErrorStatement(null);
    if (value === 'true') {
      dispatchupdateToggleEnrollmentCard(true);
    }
    if (value === 'false') {
      dispatchupdateToggleEnrollmentCard(false);
    }
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
                    <VaRadioOption
                      id="vye-radio-button-no"
                      label="No, this information isn't correct."
                      name="vye-radio-group1"
                      tile
                      value="false"
                    />
                  </VaRadio>
                </div>
                <p className="vye-text-block vads-u-margin-top--3">
                  If you select “No, this information isn’t correct” we will
                  pause your monthly payment until your information is updated.
                  Work with your School Certifying Official (SCO) to ensure your
                  enrollment information is updated with the VA.
                </p>
                <div
                  style={{
                    paddingLeft: '8px',
                  }}
                >
                  <VaButtonPair
                    continue
                    onPrimaryClick={handleNextClick}
                    onSecondaryClick={handleBackClick}
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
  enrollmentData: state.mockData.mockData,
});

const mapDispatchToProps = {
  dispatchupdateToggleEnrollmentCard: updateToggleEnrollmentCard,
};

VerificationReviewWrapper.propTypes = {
  dispatchupdateToggleEnrollmentCard: PropTypes.func,
  children: PropTypes.any,
  enrollmentData: PropTypes.object,
  link: PropTypes.func,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerificationReviewWrapper);
