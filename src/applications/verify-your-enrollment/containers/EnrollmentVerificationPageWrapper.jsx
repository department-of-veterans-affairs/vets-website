import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getToggleEnrollmentSuccess } from '../selectors/getToggleEnrollmentSuccess';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import MGIBEnrollmentStatement from '../components/MGIBEnrollmentStatement';
import PreviousEnrollmentVerifications from '../components/PreviousEnrollmentVerifications';
import PageLink from '../components/PageLink';

import {
  BENEFITS_PROFILE_RELATIVE_URL,
  BENEFITS_PROFILE_URL,
  VERIFICATION_REVIEW_RELATIVE_URL,
  VERIFICATION_REVIEW_URL,
} from '../constants';
import { useScrollToTop } from '../hooks/useScrollToTop';
import CurrentBenefitsStatus from '../components/CurrentBenefitsStatus';
import { useData } from '../hooks/useData';
import MoreInfoCard from '../components/MoreInfoCard';
import NeedHelp from '../components/NeedHelp';
import Loader from '../components/Loader';
import PeriodsToVerify from '../components/PeriodsToVerify';
import { isSameMonth, getDateRangesBetween } from '../helpers';

const EnrollmentVerificationPageWrapper = ({ children }) => {
  useScrollToTop();
  const { expirationDate, updated, month, day, loading } = useData();
  const response = useSelector(state => state.personalInfo);
  const personalInfo = response?.personalInfo?.['vye::UserInfo'];
  const toggleEnrollmentSuccess = useSelector(getToggleEnrollmentSuccess);
  const enrollmentData = personalInfo;
  const [expandedEnrollmentData, setExpandedEnrollmentData] = useState({});

  useEffect(
    () => {
      const expandAllEnrollments = () => {
        /*
          make sure the begin date and end date are in the same month,
          if not then expand the enrollment period for each month
          between the begin and end dates of the enrollment
        */

        const pending = personalInfo?.pendingVerifications;
        const verified = personalInfo?.verifications;

        const expandedPending = [];
        const expendedVerified = [];

        verified.forEach(enrollment => {
          if (enrollment.actBegin !== null && enrollment.actEnd !== null) {
            if (!isSameMonth(enrollment.actBegin, enrollment.actEnd)) {
              const expandedMonths = getDateRangesBetween(
                enrollment.actBegin,
                enrollment.actEnd,
              );
              expandedMonths.forEach(period => {
                const [startDate, endDate] = period.split(' - ');
                expendedVerified.push({
                  actBegin: startDate,
                  actEnd: endDate,
                  paymentDate: enrollment.paymentDate,
                  transactDate: enrollment.transactDate,
                  caseTrace: enrollment.caseTrace,
                  monthlyRate: enrollment.monthlyRate,
                  numberHours: enrollment.numberHours,
                  sourceInd: enrollment.sourceInd,
                  awardId: enrollment.awardId,
                });
              });
            } else {
              expendedVerified.push({ ...enrollment });
            }
          } else {
            expendedVerified.push({ ...enrollment });
          }
        });

        pending.forEach(enrollment => {
          if (!isSameMonth(enrollment.actBegin, enrollment.actEnd)) {
            const expandedMonths = getDateRangesBetween(
              enrollment.actBegin,
              enrollment.actEnd,
            );
            expandedMonths.forEach(period => {
              const [startDate, endDate] = period.split(' - ');
              expandedPending.push({
                actBegin: startDate,
                actEnd: endDate,
                paymentDate: enrollment.paymentDate,
                transactDate: enrollment.transactDate,
                caseTrace: enrollment.caseTrace,
                monthlyRate: enrollment.monthlyRate,
                numberHours: enrollment.numberHours,
                sourceInd: enrollment.sourceInd,
                awardId: enrollment.awardId,
              });
            });
          } else {
            expandedPending.push({
              actBegin: enrollment.actBegin,
              actEnd: enrollment.actEnd,
              paymentDate: enrollment.paymentDate,
              transactDate: enrollment.transactDate,
              caseTrace: enrollment.caseTrace,
              monthlyRate: enrollment.monthlyRate,
              numberHours: enrollment.numberHours,
              sourceInd: enrollment.sourceInd,
              awardId: enrollment.awardId,
            });
          }
        });

        const tempEnrollments = {
          ...personalInfo,
          pendingVerifications: expandedPending,
          verifications: expendedVerified,
        };

        /* eslint-disable no-unused-expressions */
        setExpandedEnrollmentData(tempEnrollments);
      };

      personalInfo && expandAllEnrollments();
    },
    /* eslint-disable react-hooks/exhaustive-deps */
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
            <MGIBEnrollmentStatement />
            {loading ? (
              <Loader />
            ) : (
              <>
                <PeriodsToVerify
                  enrollmentData={expandedEnrollmentData}
                  link={() => (
                    <PageLink
                      linkText="Start enrollment verification"
                      relativeURL={VERIFICATION_REVIEW_RELATIVE_URL}
                      URL={VERIFICATION_REVIEW_URL}
                      margin="0"
                      className="vye-mimic-va-button vads-u-font-family--sans"
                    />
                  )}
                  toggleEnrollmentSuccess={toggleEnrollmentSuccess}
                />
                <CurrentBenefitsStatus
                  updated={updated}
                  remainingBenefits={`${month} Months, ${day} Days`}
                  expirationDate={expirationDate}
                  link={() => (
                    <PageLink
                      linkText="Manage your Montgomery GI Bill benefits information"
                      relativeURL={BENEFITS_PROFILE_RELATIVE_URL}
                      URL={BENEFITS_PROFILE_URL}
                      margin="0"
                      className="vads-c-action-link--blue"
                    />
                  )}
                />
              </>
            )}
            <PreviousEnrollmentVerifications
              enrollmentData={expandedEnrollmentData}
            />

            <MoreInfoCard
              marginTop="7"
              linkText="Manage your Montgomery GI Bill benefits information"
              relativeURL={BENEFITS_PROFILE_RELATIVE_URL}
              URL={BENEFITS_PROFILE_URL}
              className="vads-u-font-family--sans vads-u-font-weight--bold"
              linkDescription="Update your contact and direct deposit information for your Montgomery GI Bill benefits."
            />
            <NeedHelp />
            {children}
          </div>
        </div>
        <va-back-to-top />
      </div>
    </>
  );
};
EnrollmentVerificationPageWrapper.propTypes = {
  children: PropTypes.any,
};

export default EnrollmentVerificationPageWrapper;
