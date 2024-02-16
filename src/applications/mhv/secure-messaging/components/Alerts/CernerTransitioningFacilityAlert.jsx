/**  This component is used to display an alert to users who are associated with a facility that is transitioning to Cerner. 
The alert will display custom content that will have to be updated per facility.

"isCerner" flag that is contained in a facility object derived from the user profile is considered to be not fully reliable 
during transition periods and may not be updated timely. Drupal CMS is currently the source of truth for this information. 
Facility info is pulled from the drupalStaticData reducer. 

The facility info is then compared to the user's facilities to determine if the user is associated with a transitioning facility.
Since neither Drupal nor user profile do not contain transition dates and those are flexible, the alert will be displayed based on the feature flag toggles.

Once the facility ehr is updated to 'cerner' in Drupal CMS, the facility is considered to be transitioned to Cerner and this alert will be disregarded regardless of the feature flag toggles.
After transitioning, need to ensure that CernerFacilityAlert is displayed to users who are associated with Cerner facilities.
*/

import React, { useMemo } from 'react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { useSelector } from 'react-redux';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { CernerTransitioningFacilities } from '../../util/constants';

const CernerTransitioningFacilityAlert = () => {
  const user = useSelector(selectUser);
  const { featureToggles } = useSelector(state => state);
  const transitioningFacilityId =
    CernerTransitioningFacilities.NORTH_CHICAGO.facilityId;

  const cernerTransition556T30 = useMemo(
    () => {
      return featureToggles[FEATURE_FLAG_NAMES.cernerTransition556T30]
        ? featureToggles[FEATURE_FLAG_NAMES.cernerTransition556T30]
        : false;
    },
    [featureToggles],
  );
  const cernerTransition556T5 = useMemo(
    () => {
      return featureToggles[FEATURE_FLAG_NAMES.cernerTransition556T5]
        ? featureToggles[FEATURE_FLAG_NAMES.cernerTransition556T5]
        : false;
    },
    [featureToggles],
  );

  const userFacilities = user.profile.facilities;
  const ehrFacilities = useSelector(selectEhrDataByVhaId);

  const isTranstioningFacility = useMemo(
    () => {
      const transitioningFacility = ehrFacilities[transitioningFacilityId];
      if (
        userFacilities &&
        transitioningFacility &&
        transitioningFacility.ehr !== 'cerner' &&
        userFacilities.some(
          facility =>
            parseInt(facility.facilityId, 10) ===
            parseInt(transitioningFacility.vhaId, 10),
        )
      ) {
        return transitioningFacility;
      }
      return null;
    },
    [userFacilities, ehrFacilities],
  );

  const contentT30 = useMemo(
    () => {
      return (
        isTranstioningFacility && (
          <va-alert status="warning" class="vads-u-margin-y--2">
            <h1 slot="headline">
              Your health facility is moving to My VA Health
            </h1>
            <div>
              <p>
                <strong>{isTranstioningFacility.vamcSystemName}</strong> is
                moving to our My VA Health portal.
              </p>
              <ul>
                <li>
                  Starting on <strong>March 4,</strong> you won’t be able to use
                  this My HealtheVet tool to send messages to care teams at this
                  facility.
                </li>
                <li>
                  Starting on <strong>March 9,</strong> you can use the new My
                  VA Health portal to send messages to these care teams.
                </li>
              </ul>
            </div>
          </va-alert>
        )
      );
    },
    [isTranstioningFacility],
  );

  const contentT5 = useMemo(
    () => {
      return (
        isTranstioningFacility && (
          <va-alert status="warning" class="vads-u-margin-y--2">
            <h1 slot="headline">
              You can’t send messages to some of your care teams right now
            </h1>
            <div>
              <p>
                We’re moving data for{' '}
                <strong>{isTranstioningFacility.vamcSystemName}</strong> to our
                My VA Health portal. On March 9, you can start using My VA
                Health to send messages to care teams at this facility.
              </p>
              <p>To contact your care team now, call your facility.</p>
              <p>
                <a href="/find-locations" target="_blank">
                  Find your VA health facility
                </a>
              </p>
            </div>
          </va-alert>
        )
      );
    },
    [isTranstioningFacility],
  );

  const content = () => {
    if (cernerTransition556T5) {
      return contentT5;
    }
    if (cernerTransition556T30) {
      return contentT30;
    }
    return null;
  };

  return <>{isTranstioningFacility && content()}</>;
};

export default CernerTransitioningFacilityAlert;
