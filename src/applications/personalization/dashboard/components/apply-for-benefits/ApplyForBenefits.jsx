import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import { VA_FORM_IDS } from '~/platform/forms/constants';
import recordEvent from '~/platform/monitoring/record-event';
import {
  // isMultifactorEnabled,
  isVAPatient,
  isLOA3,
  selectProfile,
} from '~/platform/user/selectors';

import {
  filterOutExpiredForms,
  formBenefits,
} from '~/applications/personalization/dashboard/helpers';

import { getEnrollmentStatus as getEnrollmentStatusAction } from '~/applications/hca/actions';
import { HCA_ENROLLMENT_STATUSES } from '~/applications/hca/constants';
import {
  hasServerError as hasESRServerError,
  selectEnrollmentStatus as selectESRStatus,
} from '~/applications/hca/selectors';

import { fetchEDUPaymentInformation as fetchEDUPaymentInformationAction } from '@@profile/actions/paymentInformation';
// import {
//   eduDirectDepositInformation,
//   eduDirectDepositIsSetUp,
// } from '@@profile/selectors';

import ApplicationsInProgress from './ApplicationsInProgress';
import BenefitOfInterest from './BenefitOfInterest';

const AllBenefits = () => (
  <div className="vads-u-margin-top--2">
    <AdditionalInfo triggerText="What benefits does VA offer?">
      <p className="vads-u-font-weight--bold">
        Explore VA.gov to learn about the benefits we offer.
      </p>
      <ul>
        <li>
          <a href="/health-care/">Health care</a>
        </li>
        <li>
          <a href="/education/">Education and training</a>
        </li>
        <li>
          <a href="/disability/">Disability compensation</a>
        </li>
        <li>
          <a href="/careers-employment/">Careers &amp; employment</a>
        </li>
        <li>
          <a href="/pension/">Pension</a>
        </li>
        <li>
          <a href="/housing-assistance/">Housing assistance</a>
        </li>
        <li>
          <a href="/burials-memorials/">Burials &amp; memorials</a>
        </li>
        <li>
          <a href="/life-insurance/">Life insurance</a>
        </li>
        <li>
          <a href="/service-member-benefits/">Service member benefits</a>
        </li>
        <li>
          <a href="/family-member-benefits/">Family member benefits</a>
        </li>
      </ul>
    </AdditionalInfo>
  </div>
);

const BenefitsOfInterest = ({ children, showChildren }) => {
  return (
    <>
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5">
        VA benefits you might be interested in
      </h3>
      <div data-testid="benefits-of-interest">
        {showChildren ? (
          <div className="vads-l-row">{children}</div>
        ) : (
          <div className="vads-u-margin-y--2">
            <LoadingIndicator message="Loading benefits you might be interested in..." />
          </div>
        )}
      </div>
    </>
  );
};

const ApplyForBenefits = ({
  // getDD4EDUStatus,
  getESREnrollmentStatus,
  hasDD4EDU,
  hasHCAInProgress,
  hasLoadedAllData,
  isInESR,
  isPatient,
  // shouldGetDD4EDUStatus,
  shouldGetESRStatus,
  hasEDUInProgress,
}) => {
  useEffect(
    () => {
      if (shouldGetESRStatus) {
        getESREnrollmentStatus();
      }
    },
    [shouldGetESRStatus, getESREnrollmentStatus],
  );

  // useEffect(
  //   () => {
  //     if (shouldGetDD4EDUStatus) {
  //       getDD4EDUStatus();
  //     }
  //   },
  //   [shouldGetDD4EDUStatus, getDD4EDUStatus],
  // );

  const hideHealthCareBenefitInfo = hasHCAInProgress || isPatient || isInESR;
  const hideEducationBenefitInfo = hasDD4EDU || hasEDUInProgress;

  return (
    <div data-testid="dashboard-section-apply-for-benefits">
      <h2>Apply for VA benefits</h2>
      <AllBenefits />
      <ApplicationsInProgress />
      <BenefitsOfInterest showChildren={hasLoadedAllData}>
        <>
          {hideHealthCareBenefitInfo ? null : (
            <BenefitOfInterest
              title="Health care"
              icon="health-care"
              ctaButtonLabel="Learn how to apply for VA health care"
              ctaUrl="/health-care/how-to-apply/"
              onClick={() => {
                recordEvent({
                  event: 'dashboard-navigation',
                  'dashboard-action': 'view-link',
                  'dashboard-product': 'recommendations-health-care-apply-now',
                });
              }}
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
            icon="disability"
            ctaButtonLabel="Learn how to file a VA disability claim"
            ctaUrl="/disability/how-to-file-claim/"
            onClick={() => {
              recordEvent({
                event: 'dashboard-navigation',
                'dashboard-action': 'view-link',
                'dashboard-product': 'recommendations-disability-file-claim',
              });
            }}
          >
            <p>
              With VA disability benefits, you can get disability compensation
              for an illness or injury that was caused, or made worse, by your
              military service.
            </p>
          </BenefitOfInterest>
          {hideEducationBenefitInfo ? null : (
            <BenefitOfInterest
              title="Education and training"
              icon="education"
              ctaButtonLabel="Learn how to apply for VA education benefits"
              ctaUrl="/education/how-to-apply/"
              onClick={() => {
                recordEvent({
                  event: 'dashboard-navigation',
                  'dashboard-action': 'view-link',
                  'dashboard-product': 'recommendations-education-apply-now',
                });
              }}
            >
              <p>
                With VA education benefits, you and your qualified family
                members can get help finding a college or training program and
                paying for tuition or test fees.
              </p>
            </BenefitOfInterest>
          )}
        </>
      </BenefitsOfInterest>
    </div>
  );
};

const mapStateToProps = state => {
  const hasHCAInProgress =
    selectProfile(state)
      .savedForms?.filter(filterOutExpiredForms)
      .some(savedForm => savedForm.form === VA_FORM_IDS.FORM_10_10EZ) ?? false;

  const hasEDUInProgress =
    selectProfile(state)
      .savedForms?.filter(filterOutExpiredForms)
      .some(
        savedForm => formBenefits[savedForm.form] === 'education benefits',
      ) ?? false;

  const isPatient = isVAPatient(state);
  const esrEnrollmentStatus = selectESRStatus(state).enrollmentStatus;

  const shouldGetESRStatus = !hasHCAInProgress && !isPatient && isLOA3(state);
  // const shouldGetDD4EDUStatus =
  //   isLOA3(state) && isMultifactorEnabled(state) && !hasEDUInProgress;
  const hasLoadedESRData =
    !shouldGetESRStatus ||
    hasESRServerError(state) ||
    esrEnrollmentStatus !== null;
  // const hasLoadedDD4EDUData =
  //   !shouldGetDD4EDUStatus || eduDirectDepositInformation(state);

  const hasLoadedAllData = hasLoadedESRData; // && hasLoadedDD4EDUData;

  return {
    // temporary while the endpoint is being worked on
    hasDD4EDU: false, // eduDirectDepositIsSetUp(state),
    hasHCAInProgress,
    hasEDUInProgress,
    hasLoadedAllData,
    isInESR:
      !!esrEnrollmentStatus &&
      esrEnrollmentStatus !== HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
    isPatient,
    // shouldGetDD4EDUStatus,
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
