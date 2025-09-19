import React, { useEffect } from 'react';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import capitalize from 'lodash/capitalize';
import NeedHelp from '../components/NeedHelp';
import { formatDate } from '../helpers';

const CheckEligibilityAndApply = () => {
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

  return (
    <div className="row">
      <div className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5">
        <h1>Check your eligibility and apply</h1>
        <p className="vads-u-font-size--lg">
          Below you will find your Chapter 31 eligibility, which includes your
          own military service, character of discharge, Service Connected
          Disability (SCD) rating, entitlement availability, and activity. You
          can print your statement below and use it as a replacement for a
          Certificate of Eligibility (COE) to show that you qualify for
          benefits. If you recently transferred entitlement, it may not be
          reflected here. If you believe any eligibility requirement is listed
          in error, please follow the link in next steps to find out how you can
          update your eligibility before you submit your application.
        </p>
        <p className="vads-u-font-size--lg">
          The Supreme Court’s Rudisill decision may increase your months of
          entitlement if you have two or more qualified periods of active duty.
        </p>

        <p className="vads-u-margin-top--2">
          <a href="https://benefits.va.gov/GIBILL/rudisill.asp">
            Find out more about requesting a Rudisill review
          </a>
        </p>
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <p className="vads-u-margin-y--0">You’re eligible!</p>
        </va-alert>
        <h2 className="vads-u-margin-top--4">Next steps</h2>
        <p>
          If any of the eligibility criteria above are incorrect or if you have
          any questions, review the requirements for{' '}
          <a href="/careers-employment/vocational-rehabilitation/">
            Eligibility for Veteran Readiness and Employment
          </a>
          .
        </p>
        <p>
          If you are eligible and have entitlement, you can apply online right
          now.
        </p>
        <p>
          <va-link-action
            href="/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/#"
            text="Apply for VR&E benefits"
            type="primary"
          />
        </p>
        <p>
          <a href="#learn-more">Learn more about how to apply</a>
        </p>
        <h2 className="vads-u-margin-top--5">Veteran Profile</h2>
        <div className="vads-u-margin-bottom--3">
          <div className="vads-u-display--flex vads-u-margin-bottom--1 vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '12rem' }}
            >
              Name:
            </span>
            <span>
              {capitalize(mockResponse.veteranProfile.firstName)}{' '}
              {capitalize(mockResponse.veteranProfile.lastName)}
            </span>
          </div>
          <div className="vads-u-display--flex vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '12rem' }}
            >
              Date of birth:
            </span>
            <span>{formatDate(mockResponse.veteranProfile.dob)}</span>
          </div>
        </div>
        <h2 className="vads-u-margin-top--4">Eligibility Criteria</h2>
        <ul className="vads-u-margin-top--0 vads-u-padding-left--0">
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
                {mockResponse.veteranProfile.servicePeriod.map((sp, idx) => (
                  <>
                    <li key={`${sp.serviceBeganDate}-${idx}`}>
                      Entered Active Duty (EOD):{' '}
                      {formatDate(sp.serviceBeganDate)};
                    </li>
                    <li key={`${sp.serviceBeganDate}-${idx}`}>
                      Released: {formatDate(sp.serviceEndDate)};
                    </li>
                  </>
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
                Disability Rating: {mockResponse.disabilityRating.combinedScd}%
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

        <h2 className="vads-u-margin-top--4">Your Benefits</h2>
        <div className="vads-u-margin-bottom--3">
          <div className="vads-u-display--flex vads-u-margin-bottom--1 vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '18rem' }}
            >
              Result:
            </span>
            <span>{mockResponse.resEligibilityRecommendation}</span>
          </div>
          <div className="vads-u-display--flex vads-u-margin-bottom--1 vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '18rem' }}
            >
              Date of claim:
            </span>
            <span>{formatDate(mockResponse.dateOfClaim)}</span>
          </div>
          <div className="vads-u-display--flex vads-u-margin-bottom--1 vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '18rem' }}
            >
              Approved by:
            </span>
            <span>{mockResponse.approvedBy}</span>
          </div>
          <div className="vads-u-display--flex vads-u-margin-bottom--1 vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '18rem' }}
            >
              Approved on:
            </span>
            <span>{mockResponse.approvedOn}</span>
          </div>
          <div className="vads-u-display--flex vads-u-margin-bottom--1 vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '18rem' }}
            >
              Max CH31 entitlement:
            </span>
            <span>
              {mockResponse.entitlementDetails.maxCh31Entitlement.month}-
              {String(
                mockResponse.entitlementDetails.maxCh31Entitlement.days,
              ).padStart(2, '0')}
            </span>
          </div>
          <div className="vads-u-display--flex vads-u-margin-bottom--1 vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '18rem' }}
            >
              CH31 remaining entitlement:
            </span>
            <span>
              {mockResponse.entitlementDetails.ch31EntitlementRemaining.month}-
              {String(
                mockResponse.entitlementDetails.ch31EntitlementRemaining.days,
              ).padStart(2, '0')}
            </span>
          </div>
          <div className="vads-u-display--flex vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '18rem' }}
            >
              Entitlement used:
            </span>
            <span>
              {mockResponse.entitlementDetails.entitlementUsed.month}-
              {String(
                mockResponse.entitlementDetails.entitlementUsed.days,
              ).padStart(2, '0')}
            </span>
          </div>
        </div>

        <NeedHelp />
        <va-back-to-top />
      </div>
    </div>
  );
};

export default CheckEligibilityAndApply;
