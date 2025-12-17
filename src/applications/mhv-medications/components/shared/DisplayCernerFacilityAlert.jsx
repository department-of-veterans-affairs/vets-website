import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CernerFacilityAlert from 'platform/mhv/components/CernerFacilityAlert/CernerFacilityAlert';
import { CernerAlertContent } from 'platform/mhv/components/CernerFacilityAlert/constants';
import { selectUserFacility } from '../../selectors/selectUser';
import { selectPrescriptionApiError } from '../../selectors/selectPrescription';
import NewCernerFacilityAlert from './NewCernerFacilityAlert';
import { selectNewCernerFacilityAlertFlag } from '../../util/selectors';

// Transitional facility IDs that should see the "New" alert
// This will eventually be moved to BE logic using an AWS Parameter Store list
// Once the BE flag logic is in place, both alerts will be handled by the shared CernerFacilityAlert component
const transitionalFacilityIds = ['757'];
// add all transitional facilities that we want to display the new alert for
// const transitionalFacilityIds = ['757', '653', '687', '692', '668', '556'];

/**
 * Display Cerner Facility Alert for Medications
 * FOR NOW:
 *
 * Shows ONE of two possible alerts:
 * 1. NewCernerFacilityAlert - For users with transitional facilities (based on facility ID)
 *    - Shows "New: Manage your health care on VA.gov" message
 *    - Indicates medications are now available on VA.gov for certain facilities
 *
 * 2. CernerFacilityAlert - For all other Cerner users
 *    - Shows standard "go to My VA Health" message for Cerner facilities
 *    - Based on flags from BE (user.profile.userAtPretransitionedOhFacility)
 *
 * LOGIC:
 * - IF feature flag enabled AND user has transitional facility → Show NewCernerFacilityAlert
 * - ELSE → Show CernerFacilityAlert (which handles OH/acceleration logic in vets-api)
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
        <CernerFacilityAlert
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
