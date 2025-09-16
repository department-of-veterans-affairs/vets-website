import React, { useEffect } from 'react';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import Breadcrumbs from '../components/Breadcrumbs';

const CheckEligibilityAndApply = () => {
  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  const mockEligibility = {
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
    resEligibilityRecommendation: 'Ineligible',
  };

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

        <div className="vads-u-margin-y--2 vads-u-padding--2 vads-u-border--2px vads-u-border-color--primary">
          <va-icon icon="check_circle" size="3" />
          <strong className="vads-u-margin-left--1">You’re eligible!</strong>
        </div>

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
          <va-link
            href="/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/"
            text="Apply for VR&E benefits"
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
              {mockEligibility.veteranProfile.firstName}{' '}
              {mockEligibility.veteranProfile.lastName}
            </span>
          </div>
          <div className="vads-u-display--flex vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '12rem' }}
            >
              Date of birth:
            </span>
            <span>{formatDate(mockEligibility.veteranProfile.dob)}</span>
          </div>
        </div>

        <h2 className="vads-u-margin-top--4">Eligibility Criteria</h2>
        <ul className="vads-u-margin-top--0">
          <li>
            <strong>Qualifying Military Service:</strong>
            <ul>
              {mockEligibility.veteranProfile.servicePeriod.map((sp, idx) => (
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
            {mockEligibility.veteranProfile.characterOfDischarge}
          </li>
          <li>
            <strong>Disability Rating:</strong>{' '}
            {mockEligibility.disabilityRating.combinedScd}%
            <ul>
              {mockEligibility.disabilityRating.SCDDetails.map(detail => (
                <li key={detail.code}>
                  {detail.code} - {detail.name} - {detail.percentage}%
                </li>
              ))}
            </ul>
          </li>
          <li>
            <strong>Initial rating Notification Date:</strong>{' '}
            {formatDate(mockEligibility.IRNDDate)}
          </li>
          <li>
            <strong>Eligibility Termination Date:</strong>{' '}
            {formatDate(mockEligibility.eligibilityTerminationDate)}
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
              {mockEligibility.resEligibilityRecommendation === 'Eligible'
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
            <span>{formatDate(mockEligibility.dateOfClaim)}</span>
          </div>
          <div className="vads-u-display--flex vads-u-margin-bottom--1 vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '18rem' }}
            >
              Approved by:
            </span>
            <span>{mockEligibility.approvedBy}</span>
          </div>
          <div className="vads-u-display--flex vads-u-margin-bottom--1 vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '18rem' }}
            >
              Approved on:
            </span>
            <span>{mockEligibility.approvedOn}</span>
          </div>
          <div className="vads-u-display--flex vads-u-margin-bottom--1 vads-u-align-items--baseline">
            <span
              className="vads-u-font-weight--bold"
              style={{ minWidth: '18rem' }}
            >
              Max CH31 entitlement:
            </span>
            <span>
              {mockEligibility.entitlementDetails.maxCh31Entitlement.month}-
              {String(
                mockEligibility.entitlementDetails.maxCh31Entitlement.days,
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
              {
                mockEligibility.entitlementDetails.ch31EntitlementRemaining
                  .month
              }
              -
              {String(
                mockEligibility.entitlementDetails.ch31EntitlementRemaining
                  .days,
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
              {mockEligibility.entitlementDetails.entitlementUsed.month}-
              {String(
                mockEligibility.entitlementDetails.entitlementUsed.days,
              ).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEligibilityAndApply;
