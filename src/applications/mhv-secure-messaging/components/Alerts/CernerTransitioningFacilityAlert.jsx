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
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * @param {boolean} t5 - boolean flag to display the alert for 5 days before transition
 * @param {boolean} t30 - boolean flag to display the alert for 30 days before transition
 * @param {string} facilityId - facility id
 */
const CernerTransitioningFacilityAlert = ({ t5, t30, facilityId }) => {
  const user = useSelector(selectUser);
  const transitioningFacilityId = facilityId;
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
        return getVamcSystemNameFromVhaId(
          ehrFacilities,
          transitioningFacility.vhaId,
        );
      }
      return null;
    },
    [ehrFacilities, transitioningFacilityId, userFacilities],
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
                <strong>{isTranstioningFacility}</strong> is moving to our My VA
                Health portal. test
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
                We’re moving data for <strong>{isTranstioningFacility}</strong>{' '}
                to our My VA Health portal. On March 9, you can start using My
                VA Health to send messages to care teams at this facility.
              </p>
              <p>To contact your care team now, call your facility.</p>
              <p>
                <VaLinkAction
                  href="/find-locations"
                  data-testid="find-facility-action-link"
                  text="Find your VA health facility"
                />
              </p>
            </div>
          </va-alert>
        )
      );
    },
    [isTranstioningFacility],
  );

  const content = () => {
    if (t5) return contentT5;
    if (t30) return contentT30;
    return null;
  };

  return <>{content()}</>;
};

CernerTransitioningFacilityAlert.propTypes = {
  facilityId: PropTypes.string,
  t30: PropTypes.bool,
  t5: PropTypes.bool,
};

export default CernerTransitioningFacilityAlert;
