import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import {
  isMultifactorEnabled,
  isVAPatient,
  selectProfile,
} from '~/platform/user/selectors';

import {
  formLinks,
  formTitles,
  isSIPEnabledForm,
  presentableFormIDs,
  sipFormSorter,
} from '~/applications/personalization/dashboard/helpers';
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

import ApplicationInProgress from './ApplicationInProgress';
import BenefitOfInterest from './BenefitOfInterest';

const ApplicationsInProgress = ({ verifiedSavedForms }) => {
  return (
    <>
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5">
        Applications in progress
      </h3>
      {verifiedSavedForms.length > 0 && (
        <div className="vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            {verifiedSavedForms.map(form => {
              const formId = form.form;
              const formTitle = `Application for ${formTitles[formId]}`;
              const presentableFormId = presentableFormIDs[formId];
              const { lastUpdated, expiresAt } = form.metadata || {};
              const lastOpenedDate = moment
                .unix(lastUpdated)
                .format('MMMM D, YYYY');
              const expirationDate = moment
                .unix(expiresAt)
                .format('MMMM D, YYYY');
              const continueUrl = `${formLinks[formId]}resume`;
              return (
                <ApplicationInProgress
                  key={formId}
                  continueUrl={continueUrl}
                  expirationDate={expirationDate}
                  formId={formId}
                  formTitle={formTitle}
                  lastOpenedDate={lastOpenedDate}
                  presentableFormId={presentableFormId}
                />
              );
            })}
          </div>
        </div>
      )}
      {!verifiedSavedForms.length && (
        <p>You have no applications in progress.</p>
      )}
    </>
  );
};

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
          <p>Explore VA.gov to learn about the benefits we offer</p>
          <ul>
            <li>
              <a>blah</a>
            </li>
            <li>
              <a>blahhhh</a>
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
  verifiedSavedForms,
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
      <ApplicationsInProgress verifiedSavedForms={verifiedSavedForms} />
      <BenefitsOfInterest showChildren={hasLoadedAllData}>
        <>
          {showHealthCare && (
            <BenefitOfInterest
              title="Health care"
              ctaButtonLabel="Apply for health care"
              ctaUrl="https://va.gov"
            >
              <p>yay! content!</p>
            </BenefitOfInterest>
          )}
          <BenefitOfInterest
            title="File a claim"
            ctaButtonLabel="File a claim"
            ctaUrl="https://va.gov"
          >
            <p>yay! content about filing a claim with the VA!!!</p>
            <p>This is two paragraphs just because we can.</p>
          </BenefitOfInterest>
          {showEducation && (
            <BenefitOfInterest
              title="Education benefits"
              ctaButtonLabel="Apply for education benefits"
              ctaUrl="https://va.gov"
            >
              <p>Education content!</p>
            </BenefitOfInterest>
          )}
        </>
      </BenefitsOfInterest>
    </>
  );
};

const mapStateToProps = state => {
  const isPatient = isVAPatient(state);
  const savedForms = selectProfile(state).savedForms || [];
  const verifiedSavedForms = savedForms
    .filter(isSIPEnabledForm)
    .sort(sipFormSorter);
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
    verifiedSavedForms,
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
