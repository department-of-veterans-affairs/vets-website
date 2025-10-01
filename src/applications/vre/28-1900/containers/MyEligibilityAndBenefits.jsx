import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import NeedHelp from '../components/NeedHelp';
import { formatDate } from '../helpers';
import { fetchCh31Eligibility } from '../actions/ch31-my-eligibility-and-benefits';

const MyEligibilityAndBenefits = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const dispatch = useDispatch();

  const loading = useSelector(state => state?.ch31Eligibility?.loading);
  const error = useSelector(state => state?.ch31Eligibility?.error);
  const ch31ApiResponse = useSelector(state => state?.ch31Eligibility?.data);

  const showEligibilityPage = useToggleValue(
    TOGGLE_NAMES.vreEligibilityStatusUpdates,
  );

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  useEffect(
    () => {
      dispatch(fetchCh31Eligibility());
    },
    [dispatch],
  );

  const attrs = ch31ApiResponse?.data?.attributes || null;

  if (!showEligibilityPage) {
    return (
      <div className="row">
        <div className="usa-width-two-thirds vads-u-margin-y--4 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
          <h1>My eligibility and benefits</h1>
          <p className="vads-u-color--gray-medium">
            This page isn’t available right now.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="row">
        <div className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
          <h1>My eligibility and benefits</h1>
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
      <div className="row">
        <div className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
          <h1>My eligibility and benefits</h1>
          <va-alert status="error" visible class="vads-u-margin-y--4">
            <h2 slot="headline">
              We can’t load the eligibility details right now
            </h2>
            <p>
              We’re sorry. There’s a problem with our system. You are still
              encouraged to proceed and apply for the VA Form 28-1900.
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

  const { veteranProfile, disabilityRating, entitlementDetails } = attrs;
  // Normalize recommendation
  const recommendation = String(attrs?.resEligibilityRecommendation ?? '')
    .trim()
    .toLowerCase();

  const isIneligibleRec = recommendation === 'ineligible';

  // Has RES case?
  const hasResCaseId =
    attrs?.resCaseId !== undefined &&
    attrs?.resCaseId !== null &&
    attrs?.resCaseId !== '' &&
    attrs?.resCaseId !== 0;

  // UI flags
  const showMissingCaseAlert = !hasResCaseId && isIneligibleRec;
  const isEligible = recommendation === 'eligible';
  const isIneligible = recommendation === 'ineligible' && hasResCaseId;

  return (
    <div className="row ">
      <div className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
        <h1>My eligibility and benefits</h1>
        {isEligible ? (
          <p className="vads-u-font-size--lg">
            Below you will find your Chapter 31 eligibility, which includes your
            own military service, character of discharge, Service Connected
            Disability (SCD) rating, remaining entitlement available, and
            activity.
          </p>
        ) : (
          <p className="vads-u-font-size--lg">
            Below you will find your Chapter 31 eligibility, which includes your
            own military service, character of discharge, Service Connected
            Disability (SCD) rating, and remaining entitlement available. If you
            recently transferred entitlement, it may not be reflected here. If
            you believe any eligibility requirement is listed in error, please
            follow the link in next steps to find out how you can update your
            eligibility before you submit your application.
          </p>
        )}

        <p className="vads-u-font-size--lg">
          The Supreme Court’s decision in Rudisill v. McDonough may grant
          additional months of benefits to individuals who have served two or
          more qualifying periods of active duty.
        </p>

        <va-link
          className="vads-u-margin-top--3 vads-u-margin-bottom--4"
          text="Find out more about requesting a Rudisill review"
          href="https://benefits.va.gov/GIBILL/rudisill.asp"
        />

        {isEligible && (
          <va-alert
            close-btn-aria-label="Close notification"
            status="success"
            visible
            class="vads-u-margin-y--6"
          >
            <h2 slot="headline">You meet the criteria for basic eligibility</h2>
            <p className="vads-u-margin-y--2">
              Since you meet the basic eligibility requirements, you may apply
              for Chapter 31 services by completing VA Form 28-1900.
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
              Our records indicate you do not meet the basic eligibility
              requirements
            </h2>
            <p className="vads-u-margin-y--2">
              You do not currently meet the basic eligibility requirements. If
              you believe this is an error, please review the{' '}
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

        {showMissingCaseAlert && (
          <va-alert
            close-btn-aria-label="Close notification"
            status="warning"
            visible
            class="vads-u-margin-y--6"
          >
            <h2 slot="headline">We are unable to determine your eligibility</h2>
            <p className="vads-u-margin-y--2">
              We are currently unable to determine your eligibility. You are
              still encouraged to proceed and apply for the VA Form 28-1900.
            </p>
            <va-link-action
              href="/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/#"
              text="Apply for VR&E benefits"
              type="primary"
            />
          </va-alert>
        )}

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
                Applicant has{' '}
                {Array.isArray(veteranProfile?.servicePeriod)
                  ? veteranProfile.servicePeriod.length
                  : 0}{' '}
                period(s) of qualifying military service after September 16,
                1940:
              </p>
              <ul className="vads-u-margin-top--0">
                {(veteranProfile?.servicePeriod || []).map((sp, index) => (
                  <div key={index}>
                    <li>
                      Entered Active Duty (EOD):{' '}
                      {formatDate(sp?.serviceBeganDate)};
                    </li>
                    <li>Released: {formatDate(sp?.serviceEndDate)};</li>
                  </div>
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
                {veteranProfile?.characterOfDischarge || '—'}
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
                Disability Rating: {disabilityRating?.combinedScd ?? '—'}%
              </strong>
              {Array.isArray(disabilityRating?.scdDetails) &&
                disabilityRating.scdDetails.length > 0 && (
                  <>
                    <p className="vads-u-margin-y--0">SCD Details:</p>
                    <ul className="vads-u-margin-top--0">
                      {disabilityRating.scdDetails.map(detail => (
                        <li key={detail?.code}>
                          {detail?.code} - {detail?.name} - {detail?.percentage}
                          %
                        </li>
                      ))}
                    </ul>
                  </>
                )}
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
                Initial rating Notification Date: {formatDate(attrs?.irndDate)}
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
                {formatDate(attrs?.eligibilityTerminationDate)}
              </strong>
            </div>
          </li>
        </ul>
        {hasResCaseId && (
          <>
            <h2 className="vads-u-margin-top--0">Your Benefits</h2>
            <div className="vads-u-margin-bottom--3">
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
                <span
                  className="vads-u-font-weight--bold"
                  style={{ minWidth: '18rem' }}
                >
                  Result
                </span>
                <span>{attrs?.resEligibilityRecommendation || '—'}</span>
              </div>

              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-align-items--baseline">
                <span
                  className="vads-u-font-weight--bold"
                  style={{ minWidth: '18rem' }}
                >
                  Total months you received:
                </span>
                <span>
                  {entitlementDetails?.maxCh31Entitlement?.month ?? 0} months,{' '}
                  {entitlementDetails?.maxCh31Entitlement?.days ?? 0} days
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
                  {entitlementDetails?.entitlementUsed?.month ?? 0} months,{' '}
                  {entitlementDetails?.entitlementUsed?.days ?? 0} days
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
                  {entitlementDetails?.ch31EntitlementRemaining?.month ?? 0}{' '}
                  months,{' '}
                  {entitlementDetails?.ch31EntitlementRemaining?.days ?? 0} days
                </span>
              </div>
            </div>
          </>
        )}

        <NeedHelp />
        <va-back-to-top />
      </div>
    </div>
  );
};

export default MyEligibilityAndBenefits;
