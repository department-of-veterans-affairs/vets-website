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
      return userFacilities?.some(facility =>
        drupalCernerFacilities?.some(
          f => f.vhaId === facility.facilityId && f.ehr === 'cerner',
        ),
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
