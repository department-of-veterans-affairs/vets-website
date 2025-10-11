import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectCernerFacilities } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import PropTypes from 'prop-types';
import { selectUserFacility } from '../../selectors/selectUser';
import { selectPrescriptionApiError } from '../../selectors/selectPrescription';
import NewCernerFacilityAlert from './NewCernerFacilityAlert';
import CernerFacilityAlert from './CernerFacilityAlert';
import { selectNewCernerFacilityAlertFlag } from '../../util/selectors';

const transitionalFacilityIds = ['757'];
// add all transitional facilities that we want to display the new alert for
// const transitionalFacilityIds = ['757', '653', '687', '692', '668', '556'];

const DisplayCernerFacilityAlert = ({ className = '' }) => {
  const showNewFacilityAlert = useSelector(selectNewCernerFacilityAlertFlag);
  const ehrDataByVhaId = useSelector(
    state => state.drupalStaticData?.vamcEhrData?.data?.ehrDataByVhaId,
  );
  const userFacilities = useSelector(selectUserFacility);
  const drupalCernerFacilities = useSelector(selectCernerFacilities);
  const prescriptionsApiError = useSelector(selectPrescriptionApiError);

  const cernerFacilities = useMemo(
    () => {
      return userFacilities?.filter(facility =>
        drupalCernerFacilities.some(
          f => f.vhaId === facility.facilityId && f.ehr === 'cerner',
        ),
      );
    },
    [userFacilities, drupalCernerFacilities],
  );

  const hasTransistionalFacility = cernerFacilities?.some(facility =>
    transitionalFacilityIds.includes(facility.facilityId),
  );

  const cernerFacilitiesNames = useMemo(
    () => {
      if (ehrDataByVhaId) {
        return cernerFacilities?.map(facility =>
          getVamcSystemNameFromVhaId(ehrDataByVhaId, facility.facilityId),
        );
      }
      return [];
    },
    [cernerFacilities, ehrDataByVhaId],
  );

  return (
    <>
      {showNewFacilityAlert && hasTransistionalFacility ? (
        <NewCernerFacilityAlert
          apiError={prescriptionsApiError}
          className={className}
        />
      ) : (
        <CernerFacilityAlert
          facilitiesNames={cernerFacilitiesNames}
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
