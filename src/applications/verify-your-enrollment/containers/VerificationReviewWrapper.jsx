/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
} from '../actions';
import {
  toLocalISOString,
  isSameMonth,
  getDateRangesBetween,
} from '../helpers';

const VerificationReviewWrapper = ({
  children,
  dispatchUpdateToggleEnrollmentSuccess,
  dispatchUpdatePendingVerifications,
  dispatchVerifyEnrollmentAction,
  verifyEnrollment,
}) => {
  useScrollToTop();
  const [isChecked, setIsChecked] = useState(false);
  const [errorStatement, setErrorStatement] = useState(null);
  const { loading, personalInfo } = useData();
  const [enrollmentPeriodsToVerify, setEnrollmentPeriodsToVerify] = useState(
    [],
  );
  const [originalPeriodsToVerify, setOriginalPeriodsToVerify] = useState([]);
  const { error } = verifyEnrollment;
  const enrollmentData = personalInfo;
  const history = useHistory();
  const handleBackClick = () => {
    history.push(VERIFICATION_RELATIVE_URL);
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setErrorStatement(null);
  };
  // used with mock data to mock what happens after
  // successfully verifying
  const handleVerification = () => {
    const currentDateTime = toLocalISOString(new Date());
    // update pendingVerifications to a blank array
    dispatchUpdatePendingVerifications([]);
    const newVerifiedEnrollments = originalPeriodsToVerify.map(period => {
      return {
        ...period,
        transactDate: currentDateTime,
        paymentDate: null,
      };
    });
    const awardIds = newVerifiedEnrollments.map(
      enrollment => enrollment.awardId,
    );

    dispatchVerifyEnrollmentAction(awardIds);
  };

  const handleSubmission = () => {
    handleVerification();
    if (!error) {
      dispatchUpdateToggleEnrollmentSuccess(true);
    }
    history.push(VERIFICATION_RELATIVE_URL);
  };

  useEffect(
    () => {
      if (enrollmentData?.['vye::UserInfo']?.pendingVerifications) {
        const { pendingVerifications } = enrollmentData?.['vye::UserInfo'];
        setOriginalPeriodsToVerify(pendingVerifications);
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
                  <label
                    className="vads-u-font-weight--bold"
                    htmlFor="enrollmentCheckbox"
                  >
                    Is this enrollment information correct?
                    <span className="vads-u-color--secondary-dark">
                      {' '}
                      (*Required)
                    </span>
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
                  <EnrollmentInformation />
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
                  <va-button
                    onClick={handleSubmission}
                    text="Submit"
                    submit
                    uswds
                    disabled={!isChecked}
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
