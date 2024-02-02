import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import { CernerTransitioningFacilities } from '../../util/constants';

const CernerTransitioningFacilityAlert = () => {
  const user = useSelector(selectUser);
  const { facilities } = user.profile;
  const { vistaFacilities } = useSelector(
    state => state.drupalStaticData.vamcEhrData.data,
  );

  const transitioningFacilities = useMemo(
    () => [CernerTransitioningFacilities.NORTH_CHICAGO],
    [],
  );

  const isTranstioningFacility = useMemo(
    () => {
      if (!facilities) {
        return false;
      }
      return facilities?.some(facility =>
        transitioningFacilities.includes(parseInt(facility.facilityId, 10)),
      );
    },
    [facilities, transitioningFacilities],
  );

  const transitioningFacilitiesName = useMemo(
    () => {
      if (!vistaFacilities) {
        return [];
      }
      return vistaFacilities.filter(facility =>
        transitioningFacilities.includes(parseInt(facility.vhaId, 10)),
      )[0].vamcSystemName;
    },
    [vistaFacilities, transitioningFacilities],
  );

  return (
    isTranstioningFacility && (
      <va-alert status="warning" class="vads-u-margin-y--2">
        <h1 slot="headline">Your health facility is moving to My VA Health</h1>
        <div>
          <p>
            <strong>{transitioningFacilitiesName}</strong> is moving to our My
            VA Health portal.
            <ul>
              <li>
                Starting on <strong>March 4,</strong> you won’t be able to use
                this My HealtheVet tool to send messages to care teams at this
                facility.
              </li>
              <li>
                Starting on <strong>March 9,</strong> you can use the new My VA
                Health portal to send messages to these care teams.
              </li>
            </ul>
          </p>
        </div>
      </va-alert>
    )
  );
};

export default CernerTransitioningFacilityAlert;
