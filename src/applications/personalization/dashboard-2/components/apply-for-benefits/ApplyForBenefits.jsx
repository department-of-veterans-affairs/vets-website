import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import { isMultifactorEnabled, isVAPatient } from '~/platform/user/selectors';

import { getEnrollmentStatus as getEnrollmentStatusAction } from '~/applications/hca/actions';
import { HCA_ENROLLMENT_STATUSES } from '~/applications/hca/constants';
import {
  hasServerError as hasESRServerError,
  selectEnrollmentStatus as selectESRStatus,
} from '~/applications/hca/selectors';

import { fetchEDUPaymentInformation as fetchEDUPaymentInformationAction } from '@@profile/actions/paymentInformation';
import {
  eduDirectDepositInformation,
  eduDirectDepositIsSetUp,
} from '@@profile/selectors';

import ApplicationsInProgress from './ApplicationsInProgress';
import BenefitOfInterest from './BenefitOfInterest';

const BenefitsOfInterest = ({ children, showChildren }) => {
  return (
    <>
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5">
        Benefits you might be interested in
      </h3>
      <div
        className="vads-l-grid-container vads-u-padding--0"
        data-testid="benefits-of-interest"
      >
        {!showChildren && (
          <div className="vads-u-margin-y--2">
            <LoadingIndicator message="Loading benefits you might be interested in..." />
          </div>
        )}
        {showChildren && <div className="vads-l-row">{children}</div>}
        <AdditionalInfo triggerText="What benefits does the VA offer?">
          <p className="vads-u-font-weight--bold">
            Explore VA.gov to learn about the benefits we offer.
          </p>
          <ul>
            <li>
              <a href="https://www.va.gov/careers-employment/">
                Careers &amp; employment
              </a>
            </li>
            <li>
              <a href="https://www.va.gov/pension/">Pension</a>
            </li>
            <li>
              <a href="https://www.va.gov/housing-assistance/">
                Housing assistance
              </a>
            </li>
            <li>
              <a href="https://www.va.gov/burials-memorials/">
                Burials &amp; memorials
              </a>
            </li>
            <li>
              <a href="https://www.va.gov/life-insurance/">Life insurance</a>
            </li>
            <li>
              <a href="https://www.va.gov/service-member-benefits/">
                Service member benefits
              </a>
            </li>
            <li>
              <a href="https://www.va.gov/family-member-benefits/">
                Family member benefits
              </a>
            </li>
            <li>
              <a href="https://www.va.gov/health-care/">Health care benefits</a>
            </li>
            <li>
              <a href="https://www.va.gov/education/">Education benefits</a>
            </li>
            <li>
              <a href="https://www.va.gov/disability/">Disability benefits</a>
            </li>
          </ul>
        </AdditionalInfo>
      </div>
    </>
  );
};

const ApplyForBenefits = ({
  getDD4EDUStatus,
  getESREnrollmentStatus,
  hasDD4EDU,
  hasLoadedAllData,
  isInESR,
  isPatient,
  shouldGetDD4EDUStatus,
  shouldGetESRStatus,
}) => {
  useEffect(
    () => {
      if (shouldGetESRStatus) {
        getESREnrollmentStatus();
      }
    },
    [shouldGetESRStatus, getESREnrollmentStatus],
  );

  useEffect(
    () => {
      if (shouldGetDD4EDUStatus) {
        getDD4EDUStatus();
      }
    },
    [shouldGetDD4EDUStatus, getDD4EDUStatus],
  );

  const showHealthCare = !isPatient && !isInESR;
  const showEducation = !hasDD4EDU;

  return (
    <>
      <h2>Apply for benefits</h2>
      <ApplicationsInProgress />
      <BenefitsOfInterest showChildren={hasLoadedAllData}>
        <>
          {showHealthCare && (
            <BenefitOfInterest
              title="Health care"
              ctaButtonLabel="Apply for health care"
              ctaUrl="https://www.va.gov/health-care/"
            >
              <p>
                With VA health care, you’ll receive coverage for services like
                regular checkups with your health care provider and specialist
                appointments.
              </p>
            </BenefitOfInterest>
          )}
          <BenefitOfInterest
            title="Disability compensation"
            ctaButtonLabel="File a disability claim"
            ctaUrl="https://www.va.gov/disability/"
          >
            <p>
              With VA disability benefits, you can get disability compensation
              for an illness or injury that was caused, or made worse, by your
              military service.
            </p>
          </BenefitOfInterest>
          {showEducation && (
            <BenefitOfInterest
              title="Education benefits"
              ctaButtonLabel="Apply for education benefits"
              ctaUrl="https://www.va.gov/education/"
            >
              <p>
                VA education benefits help Veterans, service members, and their
                qualified family members with needs like finding the right
                school or training program and paying tuition.
              </p>
            </BenefitOfInterest>
          )}
        </>
      </BenefitsOfInterest>
    </>
  );
};

const mapStateToProps = state => {
  const isPatient = isVAPatient(state);
  const esrEnrollmentStatus = selectESRStatus(state).enrollmentStatus;

  const shouldGetESRStatus = !isPatient;
  const shouldGetDD4EDUStatus = isMultifactorEnabled(state);
  const hasLoadedESRData =
    !shouldGetESRStatus ||
    hasESRServerError(state) ||
    esrEnrollmentStatus !== null;
  const hasLoadedDD4EDUData =
    !shouldGetDD4EDUStatus || eduDirectDepositInformation(state);

  const hasLoadedAllData = hasLoadedESRData && hasLoadedDD4EDUData;

  return {
    hasDD4EDU: eduDirectDepositIsSetUp(state),
    hasLoadedAllData,
    isInESR:
      !!esrEnrollmentStatus &&
      esrEnrollmentStatus !== HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
    isPatient,
    shouldGetDD4EDUStatus,
    shouldGetESRStatus,
  };
};

const mapDispatchToProps = {
  getDD4EDUStatus: fetchEDUPaymentInformationAction,
  getESREnrollmentStatus: getEnrollmentStatusAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplyForBenefits);
