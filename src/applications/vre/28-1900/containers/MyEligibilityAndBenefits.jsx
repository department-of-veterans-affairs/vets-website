import React, { useEffect } from 'react';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import NeedHelp from '../components/NeedHelp';
import { formatDate } from '../helpers';

const MyEligibilityAndBenefits = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const showEligibilityPage = useToggleValue(
    TOGGLE_NAMES.vreEligibilityStatusUpdates,
  );

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  const mockResponse = {
    veteranProfile: {
      firstName: 'VICTORIA',
      lastName: 'DUNCAN',
      dob: '1901-09-11Z',
      characterOfDischarge: 'Honorable',
      servicePeriod: [
        {
          serviceBeganDate: '1941-12-05Z',
          serviceEndDate: '1960-12-07Z',
          characterOfDischarge: 'Honorable',
        },
        {
          serviceBeganDate: '2021-01-01Z',
          serviceEndDate: '2023-04-01Z',
          characterOfDischarge: 'Honorable',
        },
      ],
    },
    disabilityRating: {
      combinedScd: 0,
      SCDDetails: [
        {
          code: '7908',
          name: 'Acromegaly',
          percentage: 50,
        },
      ],
    },
    IRNDDate: '2025-08-04Z',
    eligibilityTerminationDate: '2023-04-01Z',
    entitlementDetails: {
      maxCh31Entitlement: { month: 48, days: 0 },
      ch31EntitlementRemaining: { month: 40, days: 8 },
      entitlementUsed: { month: 7, days: 22 },
    },
    dateOfClaim: '2025-02-07Z',
    approvedBy: 'NA',
    approvedOn: 'NA',
    resCaseId: 685,
    resEligibilityRecommendation: 'Eligible',
  };

  if (showEligibilityPage) {
    return (
      <div className="row ">
        <div className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
          <h1>My eligibility and benefits</h1>
          {mockResponse.resEligibilityRecommendation === 'Eligible' ? (
            <p className="vads-u-font-size--lg">
              Below you will find your Chapter 31 eligibility, which includes
              your own military service, character of discharge, Service
              Connected Disability (SCD) rating, entitlement availability, and
              activity. You can print your statement below and use it as a
              replacement for a Certificate of Eligibility (COE) to show that
              you qualify for benefits.
            </p>
          ) : (
            <p className="vads-u-font-size--lg">
              Below you will find your Chapter 31 eligibility, which includes
              your own military service, character of discharge, Service
              Connected Disability (SCD) rating, entitlement availability, and
              activity. You can print your statement below and use it as a
              replacement for a Certificate of Eligibility (COE) to show that
              you qualify for benefits. If you recently transferred entitlement,
              it may not be reflected here. If you believe any eligibility
              requirement is listed in error, please follow the link in next
              steps to find out how you can update your eligibility before you
              submit your application.
            </p>
          )}
          <p className="vads-u-font-size--lg">
            The Supreme Court’s Rudisill decision may increase your months of
            entitlement if you have two or more qualified periods of active
            duty.
          </p>

          <p className="vads-u-margin-top--2 vads-u-margin-bottom--4">
            <va-link
              text="Find out more about requesting a Rudisill review"
              href="https://benefits.va.gov/GIBILL/rudisill.asp"
            />
          </p>
          <va-alert
            close-btn-aria-label="Close notification"
            status="success"
            visible
            class="vads-u-margin-y--6"
          >
            <h2 slot="headline">You’re eligible for benefits</h2>
            <p className="vads-u-margin-y--2">
              Since you’re eligible and have entitlement you can go ahead and
              apply using VA Form 28-1900.
            </p>
            <va-link-action
              href="/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/#"
              text="Apply for VR&E benefits"
              type="primary"
            />
          </va-alert>
          <h2 className="vads-u-margin-top--4">Eligibility Criteria</h2>
          <ul className="vads-u-margin-top--0 vads-u-padding-left--0 vads-u-padding-bottom--4">
            <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
              <va-icon
                icon="check"
                size={3}
                class="vads-u-color--green vads-u-margin-right--1 vads-u-margin-top--0p5"
              />
              <div>
                <strong>Qualifying Military Service:</strong>
                <p className="vads-u-margin-y--0">
                  Applicant has 1 period(s) of qualifying military service after
                  September 16, 1940:
                </p>
                <ul className="vads-u-margin-top--0">
                  {mockResponse.veteranProfile.servicePeriod.map(
                    (sp, index) => (
                      <div key={index}>
                        <li>
                          Entered Active Duty (EOD):{' '}
                          {formatDate(sp.serviceBeganDate)};
                        </li>
                        <li>Released: {formatDate(sp.serviceEndDate)};</li>
                      </div>
                    ),
                  )}
                </ul>
              </div>
            </li>
            <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
              <va-icon
                icon="check"
                size={3}
                class="vads-u-color--green vads-u-margin-right--1 vads-u-margin-top--0p5"
              />
              <div>
                <strong>
                  Character of discharge:{' '}
                  {mockResponse.veteranProfile.characterOfDischarge}
                </strong>
              </div>
            </li>
            <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
              <va-icon
                icon="check"
                size={3}
                class="vads-u-color--green vads-u-margin-right--1 vads-u-margin-top--0p5"
              />
              <div>
                <strong>
                  Disability Rating: {mockResponse.disabilityRating.combinedScd}
                  %
                </strong>
                <p className="vads-u-margin-y--0">SCD Details:</p>
                <ul className="vads-u-margin-top--0">
                  {mockResponse.disabilityRating.SCDDetails.map(detail => (
                    <li key={detail.code}>
                      {detail.code} - {detail.name} - {detail.percentage}%
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
              <va-icon
                icon="check"
                size={3}
                class="vads-u-color--green vads-u-margin-right--1 vads-u-margin-top--0p5"
              />
              <div>
                <strong>
                  Initial rating Notification Date:{' '}
                  {formatDate(mockResponse.IRNDDate)}
                </strong>
              </div>
            </li>
            <li className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--2">
              <va-icon
                icon="check"
                size={3}
                class="vads-u-color--green vads-u-margin-right--1 vads-u-margin-top--0p5"
              />
              <div>
                <strong>
                  Eligibility Termination Date:{' '}
                  {formatDate(mockResponse.eligibilityTerminationDate)}
                </strong>
              </div>
            </li>
          </ul>

          <h2 className="vads-u-margin-top--0">Your Benefits</h2>
          <div className="vads-u-margin-bottom--3">
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
              <span
                className="vads-u-font-weight--bold"
                style={{ minWidth: '18rem' }}
              >
                Result
              </span>
              <span>{mockResponse.resEligibilityRecommendation}</span>
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
              <span
                className="vads-u-font-weight--bold"
                style={{ minWidth: '18rem' }}
              >
                Total months you received:
              </span>
              <span>
                {mockResponse.entitlementDetails.maxCh31Entitlement.month}{' '}
                months,{' '}
                {mockResponse.entitlementDetails.maxCh31Entitlement.days} days
              </span>
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
              <span
                className="vads-u-font-weight--bold"
                style={{ minWidth: '18rem' }}
              >
                Months you used:
              </span>
              <span>
                {mockResponse.entitlementDetails.entitlementUsed.month} months,{' '}
                {mockResponse.entitlementDetails.entitlementUsed.days} days
              </span>
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
              <span
                className="vads-u-font-weight--bold"
                style={{ minWidth: '18rem' }}
              >
                Months you have left to use:
              </span>
              <span>
                {mockResponse.entitlementDetails.ch31EntitlementRemaining.month}{' '}
                months,{' '}
                {mockResponse.entitlementDetails.ch31EntitlementRemaining.days}{' '}
                days
              </span>
            </div>
          </div>

          <NeedHelp />
          <va-back-to-top />
        </div>
      </div>
    );
  }
  return null;
};

export default MyEligibilityAndBenefits;
