import React from 'react';
import PropTypes from 'prop-types';
import { useAcceleratedData } from '@department-of-veterans-affairs/mhv/exports';
import CernerFacilityAlert from './CernerFacilityAlert';
import { CernerAlertContent } from './constants';

/**
 * Accelerated Cerner Facility Alert Component
 *
 * Displays alerts to users with Cerner facilities about accessing their data in My VA Health.
 * Uses acceleration flags to determine when data has been integrated into VA.gov.
 *
 * This component wraps the base CernerFacilityAlert and adds acceleration logic.
 * All props from CernerFacilityAlert are supported and passed through.
 *
 * Usage Examples:
 *
 * // Using constants (recommended):
 * import { CernerAlertContent } from 'platform/mhv/components/CernerFacilityAlert/constants';
 *
 * <AcceleratedCernerFacilityAlert
 *   pageName="inbox"
 *   {...CernerAlertContent.SECURE_MESSAGING}
 * />
 *
 * // Custom implementation:
 * <AcceleratedCernerFacilityAlert
 *   pageName="custom-page"
 *   domain="my domain"
 *   linkPath="/pages/custom/path"
 *   headlineAction="manage"
 *   className="custom-class"
 * />
 *
 * ALERT DISPLAY LOGIC TRUTH TABLE:
 * ┌───────────┬──────────┬────────────────┬───────────────────┬──────────┬─────────────────────────────────────┐
 * │ isLoading │ isCerner │ isAccelerating │ pageName in       │ Result   │ Reason                              │
 * │           │          │                │ hideOnPage list   │          │                                     │
 * ├───────────┼──────────┼────────────────┼───────────────────┼──────────┼─────────────────────────────────────┤
 * │  true     │  any     │  any           │  any              │  HIDE    │ Data still loading, wait            │
 * │  false    │  false   │  false         │  -                │  HIDE    │ No Cerner facilities                │
 * │  false    │  false   │  true          │  -                │  HIDE    │ No Cerner facilities                │
 * │  false    │  true    │  false         │  any              │  SHOW    │ Has Cerner, not accelerating yet    │
 * │  false    │  true    │  true          │  yes              │  HIDE    │ Page data is integrated to VA.gov   │
 * │  false    │  true    │  true          │  no               │  SHOW    │ Page not integrated, still in MVH   │
 * └───────────┴──────────┴────────────────┴───────────────────┴──────────┴─────────────────────────────────────┘
 *
 * EXAMPLES:
 * - Cerner user, not accelerating, Vitals page → SHOW alert (data still in My VA Health)
 * - Cerner user, accelerating Vitals, Vitals page → HIDE alert (Vitals data integrated to VA.gov)
 * - Cerner user, accelerating Vitals, Labs page → SHOW alert (Labs not yet integrated)
 * - Non-Cerner user → Never shows alert (no Cerner facilities)
 */
const AcceleratedCernerFacilityAlert = props => {
  const { pageName } = props;
  const {
    isLoading,
    isCerner,
    isAccelerating,
    isAcceleratingAllergies,
    isAcceleratingCareNotes,
    isAcceleratingVitals,
    isAcceleratingVaccines,
    isAcceleratingLabsAndTests,
    isAcceleratingConditions,
    isAcceleratingMedications,
    isAcceleratingSecureMessaging,
  } = useAcceleratedData();

  // Build list of pages to hide alert on when their data is accelerated
  // Pages are included if:
  // - Always hidden (MR_LANDING_PAGE)
  // - User is Cerner OR specific domain is accelerating

  // NOTE: Some domains have been integrated with Lighthouse to provide OH data
  // In those cases checking for isCerner || isAcceleratingXYZ is valid to hide the alert
  const hideOnPage = [
    CernerAlertContent.MR_LANDING_PAGE.pageName,
    isCerner || isAcceleratingVitals
      ? CernerAlertContent.VITALS.pageName
      : null,
    isCerner || isAcceleratingAllergies
      ? CernerAlertContent.ALLERGIES.pageName
      : null,
    isAcceleratingVaccines ? CernerAlertContent.VACCINES.pageName : null,
    isAcceleratingCareNotes
      ? CernerAlertContent.CARE_SUMMARIES_AND_NOTES.pageName
      : null,
    isAcceleratingConditions
      ? CernerAlertContent.HEALTH_CONDITIONS.pageName
      : null,
    isAcceleratingLabsAndTests
      ? CernerAlertContent.LABS_AND_TESTS.pageName
      : null,
    isAcceleratingMedications ? CernerAlertContent.MEDICATIONS.pageName : null,
    isAcceleratingSecureMessaging
      ? CernerAlertContent.SECURE_MESSAGING.pageName
      : null,
  ].filter(Boolean);

  // STEP 0: Wait for acceleration data to load before making decisions
  // Prevents flickering and ensures we have accurate flags
  if (isLoading) {
    return null;
  }

  // STEP 1: If user has no Cerner facilities, never show alert
  // No need to warn about My VA Health if they don't use it
  if (!isCerner) {
    return null;
  }

  // STEP 2: If user is accelerating AND on a page/domain that's been integrated, hide alert
  // When a page's data is integrated to VA.gov, users don't need to go to My VA Health for it
  if (hideOnPage.includes(pageName) && (isCerner || isAccelerating)) {
    return null;
  }

  // STEP 3: Show alert for Cerner users when:
  // - Not accelerating yet (all data still in My VA Health), OR
  // - Accelerating but on a page that hasn't been integrated yet

  // Pass through all props to the underlying CernerFacilityAlert component
  return <CernerFacilityAlert {...props} />;
};

AcceleratedCernerFacilityAlert.propTypes = {
  // Required for acceleration logic
  pageName: PropTypes.string,
  // All props from CernerFacilityAlert are also supported and passed through:
  domain: PropTypes.string,
  linkPath: PropTypes.string,
  apiError: PropTypes.bool,
  className: PropTypes.string,
  onLinkClick: PropTypes.func,
  headlineAction: PropTypes.string,
  bodyIntro: PropTypes.string,
  bodyActionSingle: PropTypes.string,
  bodyActionMultiple: PropTypes.string,
};

export default AcceleratedCernerFacilityAlert;
