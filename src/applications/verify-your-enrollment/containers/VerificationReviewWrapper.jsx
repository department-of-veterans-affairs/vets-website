/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import { useScrollToTop } from '../hooks/useScrollToTop';
import VerifyEnrollmentStatement from '../components/VerifyEnrollmentStatement';
import EnrollmentCard from '../components/Enrollmentcard';
import NeedHelp from '../components/NeedHelp';
import { EnrollmentInformation, VERIFICATION_RELATIVE_URL } from '../constants';
import Loader from '../components/Loader';
import { useData } from '../hooks/useData';
import {
  updateToggleEnrollmentSuccess,
  updatePendingVerifications,
  updateVerifications,
  verifyEnrollmentAction,
  VERIFY_ENROLLMENT_FAILURE,
} from '../actions';
import { isSameMonth, getDateRangesBetween } from '../helpers';

const VerificationReviewWrapper = ({
  children,
  dispatchUpdateToggleEnrollmentSuccess,
  dispatchVerifyEnrollmentAction,
}) => {
  useScrollToTop();
  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorStatement, setErrorStatement] = useState(null);
  const { loading, personalInfo } = useData();
  const [enrollmentPeriodsToVerify, setEnrollmentPeriodsToVerify] = useState(
    [],
  );
  const enrollmentData = personalInfo;
  const awardsIds = enrollmentData?.['vye::UserInfo']?.pendingVerifications.map(
    user => user.awardId,
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const handleBackClick = () => {
    history.push(VERIFICATION_RELATIVE_URL);
  };
  const handleCheckboxChange = e => {
    const { checked } = e.detail;
    dispatch({ type: 'RESET_ENROLLMENT_ERROR' });
    setIsChecked(checked);
    if (checked) {
      setShowError(false);
    }
    setErrorStatement(null);
  };
  // used with mock data to mock what happens after
  // successfully verifying
  const handleVerification = () => {
    const submissionError = new Error('Internal Server Error.');

    if (awardsIds.length > 0) {
      dispatchVerifyEnrollmentAction(awardsIds);
      dispatchUpdateToggleEnrollmentSuccess(true);
    } else {
      dispatch({
        type: VERIFY_ENROLLMENT_FAILURE,
        errors: submissionError.toString(),
      });
    }
  };

  const handleSubmission = () => {
    if (!isChecked) {
      setShowError(true);
    } else if (isChecked) {
      setShowError(false);
      handleVerification();
      history.push(VERIFICATION_RELATIVE_URL);
    }
  };

  useEffect(
    () => {
      if (enrollmentData?.['vye::UserInfo']?.pendingVerifications) {
        const { pendingVerifications } = enrollmentData?.['vye::UserInfo'];
        const expandedPendingEnrollments = [];
        pendingVerifications.forEach(enrollment => {
          if (!isSameMonth(enrollment.actBegin, enrollment.actEnd)) {
            const expandedMonths = getDateRangesBetween(
              enrollment.actBegin,
              enrollment.actEnd,
            );
            expandedMonths.forEach(period => {
              const [startDate, endDate] = period.split(' - ');
              expandedPendingEnrollments.push({
                actBegin: startDate,
                actEnd: endDate,
                monthlyRate: enrollment.monthlyRate,
                numberHours: enrollment.numberHours,
              });
            });
          } else {
            expandedPendingEnrollments.push({
              actBegin: enrollment.actBegin,
              actEnd: enrollment.actEnd,
              monthlyRate: enrollment.monthlyRate,
              numberHours: enrollment.numberHours,
            });
          }
        });

        setEnrollmentPeriodsToVerify(expandedPendingEnrollments);
        // setEnrollmentPeriodsToVerify(pendingVerifications);
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
  useEffect(
    () => {
      focusElement('h1');
    },
    [enrollmentData, errorStatement],
  );
  useEffect(
    () => {
      let timer;
      if (showError) {
        timer = setTimeout(() => {
          focusElement('#enrollmentCheckbox');
        }, 2500);
      }
      return () => clearTimeout(timer);
    },
    [showError, enrollmentData],
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
                <div className="vads-u-margin-top--2">
                  <div
                    className={`${
                      showError
                        ? 'vads-u-margin-left--2p5 schemaform-field-template usa-input-error'
                        : ''
                    }`}
                  >
                    <label
                      className="vads-u-font-weight--bold"
                      htmlFor="enrollmentCheckbox"
                    >
                      Is this enrollment information correct?
                      <span className="vads-u-color--secondary-dark">
                        {' '}
                        (*Required)
                      </span>
                      {showError && (
                        <span
                          role="alert"
                          className="usa-input-error-message"
                          id="root_educationType-error-message"
                        >
                          <span className="sr-only">Error</span> Please check
                          the box to confirm the information is correct.
                        </span>
                      )}
                      <VaCheckbox
                        id="enrollmentCheckbox"
                        label="Yes, this information is correct"
                        checked={isChecked}
                        onVaChange={handleCheckboxChange}
                        aria-describedby="authorize-text"
                        enable-analytics
                        uswds
                      />
                    </label>
                  </div>
                  <EnrollmentInformation />
                </div>
                <div className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--column-reverse medium-screen:vads-u-flex-direction--row">
                  <va-button
                    onClick={handleBackClick}
                    back
                    uswds
                    class="vads-u-margin-top--2 medium-screen:vads-u-margin-top--0"
                  />
                  <va-button
                    text="Submit"
                    onClick={handleSubmission}
                    submit
                    uswds
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
  verifyEnrollment: state.verifyEnrollment,
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
  link: PropTypes.func,
  loggedIEnenrollmentData: PropTypes.object,
  mockData: PropTypes.object,
  verifyEnrollment: PropTypes.object,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerificationReviewWrapper);
