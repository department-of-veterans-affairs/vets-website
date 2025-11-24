import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectCernerFacilities } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { selectCernerPilotFlag } from '../../util/selectors';
import { selectUserFacility } from '../../selectors/selectUser';
import DisplayCernerFacilityAlert from './DisplayCernerFacilityAlert';

const OracleHealthPilotCernerFacilityAlert = ({ className = '' }) => {
  const isOracleHealthPilot = useSelector(selectCernerPilotFlag);
  const userFacilities = useSelector(selectUserFacility);
  const drupalCernerFacilities = useSelector(selectCernerFacilities);

  const hasCernerFacilities = useMemo(
    () => {
      if (!userFacilities || !drupalCernerFacilities) {
        return false;
      }
      // Create a Set of Cerner facility IDs for O(1) lookup
      const cernerFacilityIds = new Set(
        drupalCernerFacilities
          .filter(f => f.ehr === 'cerner')
          .map(f => f.vhaId),
      );
      return userFacilities.some(facility =>
        cernerFacilityIds.has(facility.facilityId),
      );
    },
    [userFacilities, drupalCernerFacilities],
  );

  // If Oracle Health pilot is enabled and user has Cerner facilities,
  // suppress the alert because data is unified in v2 API
  if (isOracleHealthPilot && hasCernerFacilities) {
    return null;
  }

  return <DisplayCernerFacilityAlert className={className} />;
};

OracleHealthPilotCernerFacilityAlert.propTypes = {
  className: PropTypes.string,
};

export default OracleHealthPilotCernerFacilityAlert;
