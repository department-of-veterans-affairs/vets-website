import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectCernerFacilities } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { OhTransitionFacilityIds } from '../../util/constants';
import useFeatureToggles from '../../hooks/useFeatureToggles';
import OhTransitionAlert from './OhTransitionAlert';
import CernerFacilityAlert from '../MessageList/CernerFacilityAlert';

/**
 * Wrapper component that determines which OH transition alert to display:
 * - Blue expandable info alert (OhTransitionAlert) for VHA_757 users when feature flag is ON
 * - Yellow warning alert (CernerFacilityAlert) for other OH facility users or when flag is OFF
 * - No alert for users without OH facilities
 *
 * @param {Array} cernerFacilities - Array of user's Cerner facility objects
 */
const DisplayOhTransitionAlert = ({ cernerFacilities }) => {
  const { mhvSecureMessagingOhTransitionAlert } = useFeatureToggles();
  const drupalCernerFacilities = useSelector(selectCernerFacilities);

  // Check if user has any facility that should see the blue alert
  const hasBlueAlertFacility = useMemo(
    () => {
      return cernerFacilities?.some(facility =>
        OhTransitionFacilityIds.BLUE_ALERT.includes(facility.facilityId),
      );
    },
    [cernerFacilities],
  );

  // Check if user has any OH facility (for yellow alert fallback)
  const hasOhFacility = useMemo(
    () => {
      return cernerFacilities?.some(facility =>
        drupalCernerFacilities?.some(
          f => f.vhaId === facility.facilityId && f.ehr === 'cerner',
        ),
      );
    },
    [cernerFacilities, drupalCernerFacilities],
  );

  // Decision logic per spec:
  // 1. If user has blue alert facility AND feature flag is ON → show blue alert
  // 2. Otherwise if user has OH facilities → show yellow alert
  // 3. Otherwise → no alert
  if (hasBlueAlertFacility && mhvSecureMessagingOhTransitionAlert) {
    return <OhTransitionAlert />;
  }

  if (hasOhFacility && cernerFacilities?.length > 0) {
    return <CernerFacilityAlert cernerFacilities={cernerFacilities} />;
  }

  return null;
};

DisplayOhTransitionAlert.propTypes = {
  cernerFacilities: PropTypes.arrayOf(PropTypes.object),
};

export default DisplayOhTransitionAlert;
