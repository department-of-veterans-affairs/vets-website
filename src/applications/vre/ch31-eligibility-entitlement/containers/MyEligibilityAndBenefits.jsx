import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import NeedHelp from '../components/NeedHelp';
import { fetchCh31Eligibility } from '../actions/ch31-my-eligibility-and-benefits';
import EligibilityCriteria from '../components/EligibilityCriteria';
import BenefitsSummary from '../components/BenefitsSummary';

const MyEligibilityAndBenefits = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const dispatch = useDispatch();

  const loading = useSelector(state => state?.ch31Eligibility?.loading);
  const error = useSelector(state => state?.ch31Eligibility?.error);
  const ch31ApiResponse = useSelector(state => state?.ch31Eligibility?.data);

  const showEligibilityPage = useToggleValue(
    TOGGLE_NAMES.vreEligibilityStatusUpdates,
  );

  useEffect(
    () => {
      if (!loading) {
        scrollToTop();
        focusElement('h1');
      }
    },
    [loading],
  );

  useEffect(
    () => {
      dispatch(fetchCh31Eligibility());
    },
    [dispatch],
  );

  const attrs = ch31ApiResponse?.data?.attributes || null;

  if (!showEligibilityPage) {
    return (
      <div>
        <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
          <h1>Your VR&E eligibility and benefits</h1>
          <p className="vads-u-color--gray-medium">
            This page isn’t available right now.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <div className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
          <h1>Your VR&E eligibility and benefits</h1>
          <va-loading-indicator
            set-focus
            message="Loading your eligibility..."
          />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <div className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
          <h1>Your VR&E eligibility and benefits</h1>
          <va-alert status="error" visible class="vads-u-margin-y--4">
            <h2 slot="headline">
              We can’t load the eligibility details right now
            </h2>
            <p>
              We’re sorry. There’s a problem with our system. Please wait a few
              minutes and try again or apply for benefits using the VA Form
              28-1900.
            </p>
            <va-link-action
              href="/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/#"
              text="Apply for VR&E benefits"
              type="primary"
            />
          </va-alert>
          <NeedHelp />
          <va-back-to-top />
        </div>
      </div>
    );
  }

  // No data yet (unlikely if not loading/error, but safe)
  if (!attrs) return null;

  const {
    veteranProfile,
    disabilityRating,
    irndDate,
    eligibilityTerminationDate,
    qualifyingMilitaryServiceStatus,
    characterOfDischargeStatus,
    disabilityRatingStatus,
    irndStatus,
    eligibilityTerminationDateStatus,
    entitlementDetails,
  } = attrs;
  // Normalize recommendation
  const recommendation = String(attrs?.resEligibilityRecommendation ?? '')
    .trim()
    .toLowerCase();

  const isEligible = recommendation === 'eligible';
  const isIneligible = recommendation === 'ineligible';

  return (
    <div>
      <div className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
        <h1>Your VR&E eligibility and benefits</h1>

        <p className="vads-u-font-size--lg">
          On this page you’ll find your Chapter 31 eligibility, which includes
          your own military service, character of discharge, Service Connected
          Disability (SCD) rating, and remaining entitlement available.
        </p>

        <p className="vads-u-font-size--lg">
          The Supreme Court’s decision in Rudisill v. McDonough may grant
          additional months of benefits to individuals who have served two or
          more qualifying periods of active duty.
        </p>

        <va-link
          className="vads-u-margin-top--3 vads-u-margin-bottom--4"
          text="Find out more about requesting a Rudisill review"
          href="https://benefits.va.gov/GIBILL/rudisill.asp"
          external
        />

        {isEligible && (
          <va-alert
            close-btn-aria-label="Close notification"
            status="success"
            visible
            class="vads-u-margin-y--6"
          >
            <h2 slot="headline">You meet the basic eligibility criteria </h2>
            <p className="vads-u-margin-y--2">
              Since you meet the basic eligibility criteria, you may apply for
              Chapter 31 services by completing VA Form 28-1900.
            </p>
            <va-link-action
              href="/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/#"
              text="Apply for VR&E benefits"
              type="primary"
            />
          </va-alert>
        )}
        {isIneligible && (
          <va-alert
            close-btn-aria-label="Close notification"
            status="warning"
            visible
            class="vads-u-margin-y--6"
          >
            <h2 slot="headline">
              Our records indicate you don’t meet the basic eligibility criteria
            </h2>
            <p className="vads-u-margin-y--2">
              You don’t currently meet the basic eligibility criteria. If you
              believe this is an error, please review the{' '}
              <va-link
                text="Eligibility for Veteran Readiness and Employment"
                href="https://www.va.gov/careers-employment/vocational-rehabilitation/eligibility/"
              />{' '}
              criteria for further guidance.
            </p>
            <p>
              You may still apply by completing VA Form 28- 1900 if your
              Eligibility Termination Date (ETD) has passed, or if you have a 10
              percent service connected disability rating. A Vocational
              Rehabilitation Counselor will conduct a comprehensive initial
              evaluation to determine whether you qualify for an extension of
              benefits.
            </p>
            <va-link-action
              href="/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/#"
              text="Apply for VR&E benefits"
              type="primary"
            />
          </va-alert>
        )}
        <EligibilityCriteria
          veteranProfile={veteranProfile}
          disabilityRating={disabilityRating}
          irndDate={irndDate}
          eligibilityTerminationDate={eligibilityTerminationDate}
          qualifyingMilitaryServiceStatus={qualifyingMilitaryServiceStatus}
          characterOfDischargeStatus={characterOfDischargeStatus}
          disabilityRatingStatus={disabilityRatingStatus}
          irndStatus={irndStatus}
          eligibilityTerminationDateStatus={eligibilityTerminationDateStatus}
        />
        {isEligible && (
          <BenefitsSummary
            result={attrs?.resEligibilityRecommendation}
            entitlementDetails={entitlementDetails}
          />
        )}

        <NeedHelp />
        <va-back-to-top />
      </div>
    </div>
  );
};

export default MyEligibilityAndBenefits;
