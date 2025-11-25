import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AcceleratedCernerFacilityAlert from 'platform/mhv/components/CernerFacilityAlert/AcceleratedCernerFacilityAlert';
import { CernerAlertContent } from 'platform/mhv/components/CernerFacilityAlert/constants';
import { selectUserFacility } from '../../selectors/selectUser';
import { selectPrescriptionApiError } from '../../selectors/selectPrescription';
import NewCernerFacilityAlert from './NewCernerFacilityAlert';
import { selectNewCernerFacilityAlertFlag } from '../../util/selectors';

// Transitional facility IDs that should see the "New" alert
// This will eventually be moved to BE logic using an AWS Parameter Store list
const transitionalFacilityIds = ['757'];
// add all transitional facilities that we want to display the new alert for
// const transitionalFacilityIds = ['757', '653', '687', '692', '668', '556'];

/**
 * Display Cerner Facility Alert for Medications
 *
 * Shows ONE of two possible alerts:
 * 1. NewCernerFacilityAlert - For users with transitional facilities (based on facility ID)
 *    - Shows "New: Manage your health care on VA.gov" message
 *    - Indicates medications are now available on VA.gov for certain facilities
 *
 * 2. AcceleratedCernerFacilityAlert - For all other Cerner users (tied to feature toggles)
 *    - Shows standard "go to My VA Health" message for Cerner facilities
 *    - Automatically hides when feature toggles are enabled
 *
 * LOGIC:
 * - IF feature flag enabled AND user has transitional facility → Show NewCernerFacilityAlert
 * - ELSE → Show AcceleratedCernerFacilityAlert (which handles Cerner/acceleration logic)
 */
const DisplayCernerFacilityAlert = ({ className = '' }) => {
  const showNewFacilityAlert = useSelector(selectNewCernerFacilityAlertFlag);

  const userFacilities = useSelector(selectUserFacility);
  const prescriptionsApiError = useSelector(selectPrescriptionApiError);

  const hasTransitionalFacility = userFacilities?.some(facility =>
    transitionalFacilityIds.includes(facility.facilityId),
  );

  return (
    <>
      {showNewFacilityAlert && hasTransitionalFacility ? (
        <NewCernerFacilityAlert
          apiError={prescriptionsApiError}
          className={className}
        />
      ) : (
        <AcceleratedCernerFacilityAlert
          {...CernerAlertContent.MEDICATIONS}
          apiError={prescriptionsApiError}
          className={className}
        />
      )}
    </>
  );
};

DisplayCernerFacilityAlert.propTypes = {
  className: PropTypes.string,
};

export default DisplayCernerFacilityAlert;
