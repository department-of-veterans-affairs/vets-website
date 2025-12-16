import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCernerFacilities } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import CernerFacilityAlert from 'platform/mhv/components/CernerFacilityAlert/CernerFacilityAlert';
import { CernerAlertContent } from 'platform/mhv/components/CernerFacilityAlert/constants';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { OH_TRANSITION_FACILITY_IDS } from 'platform/mhv/util/constants';
import OhTransitionAlert from './OhTransitionAlert';

/**
 * Wrapper component that determines which OH transition alert to display:
 * - Blue expandable info alert (OhTransitionAlert) for VHA_757 users when feature flag is ON
 * - Yellow warning alert (CernerFacilityAlert) for other OH facility users or when flag is OFF
 * - No alert for users without OH facilities
 */
const DisplayOhTransitionAlert = () => {
  const mhvSecureMessagingOhTransitionAlert = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingOhTransitionAlert
      ],
  );
  const drupalCernerFacilities = useSelector(selectCernerFacilities);
  const userFacilities = useSelector(state => state?.user?.profile?.facilities);

  // Get user's Cerner facilities
  const cernerFacilities = useMemo(
    () => {
      return userFacilities?.filter(facility =>
        drupalCernerFacilities?.some(
          f => f.vhaId === facility.facilityId && f.ehr === 'cerner',
        ),
      );
    },
    [userFacilities, drupalCernerFacilities],
  );

  // Check if user has any facility that should see the blue alert
  const hasBlueAlertFacility = useMemo(
    () => {
      return cernerFacilities?.some(facility =>
        OH_TRANSITION_FACILITY_IDS.BLUE_ALERT.includes(facility.facilityId),
      );
    },
    [cernerFacilities],
  );

  // Decision logic per spec:
  // 1. If user has blue alert facility AND feature flag is ON → show blue alert
  // 2. Otherwise → let CernerFacilityAlert handle display logic
  if (hasBlueAlertFacility && mhvSecureMessagingOhTransitionAlert) {
    return <OhTransitionAlert />;
  }

  // CernerFacilityAlert handles its own visibility based on userAtPretransitionedOhFacility flag
  return <CernerFacilityAlert {...CernerAlertContent.MR_LANDING_PAGE} />;
};

export default DisplayOhTransitionAlert;
