import React, { useEffect } from 'react';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import Breadcrumbs from '../components/Breadcrumbs';

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

  // TODO search for platform function
  const formatDate = isoString => {
    if (!isoString) return '';
    const trimmed = isoString.replace('Z', '');
    const date = new Date(trimmed);
    if (Number.isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="vads-l-grid-container ">
      <div className="usa-width-two-thirds vads-u-margin-bottom--4">
        <Breadcrumbs />
        <h1 className="vads-u-margin-top--2">
          Check Your Eligibility and Apply
        </h1>
        <p>
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
        <p>
          The Supreme Court’s Rudisill decision may increase your months of
          entitlement if you have two or more qualified periods of active duty.
        </p>

        <p className="vads-u-margin-top--2">
          <a href="#rudisill-info">
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
              {mockResponse.veteranProfile.firstName}{' '}
              {mockResponse.veteranProfile.lastName}
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
        <ul className="vads-u-margin-top--0">
          <li>
            <strong>Qualifying Military Service:</strong>
            <ul>
              {mockResponse.veteranProfile.servicePeriod.map((sp, idx) => (
                <li key={`${sp.serviceBeganDate}-${idx}`}>
                  Entered: {formatDate(sp.serviceBeganDate)}; Released:{' '}
                  {formatDate(sp.serviceEndDate)}; CoD:{' '}
                  {sp.characterOfDischarge}
                </li>
              ))}
            </ul>
          </li>
          <li>
            <strong>Character of discharge:</strong>{' '}
            {mockResponse.veteranProfile.characterOfDischarge}
          </li>
          <li>
            <strong>Disability Rating:</strong>{' '}
            {mockResponse.disabilityRating.combinedScd}%
            <ul>
              {mockResponse.disabilityRating.SCDDetails.map(detail => (
                <li key={detail.code}>
                  {detail.code} - {detail.name} - {detail.percentage}%
                </li>
              ))}
            </ul>
          </li>
          <li>
            <strong>Initial rating Notification Date:</strong>{' '}
            {formatDate(mockResponse.IRNDDate)}
          </li>
          <li>
            <strong>Eligibility Termination Date:</strong>{' '}
            {formatDate(mockResponse.eligibilityTerminationDate)}
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
            <span>
              {mockResponse.resEligibilityRecommendation === 'Eligible'
                ? 'Eligible'
                : 'Ineligible'}
            </span>
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
      </div>
    </div>
  );
};

export default CheckEligibilityAndApply;
