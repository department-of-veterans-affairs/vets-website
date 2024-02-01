import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import { getCernerURL } from '~/platform/utilities/cerner';
import { CernerTransitioningFacilities } from '../../util/constants';

const CernerTransitioningFacilityAlert = () => {
  const { featureToggles } = useSelector(state => state);
  const user = useSelector(selectUser);
  const { facilities } = user.profile;

  const cernerTransition556T30 = useMemo(
    () => {
      return featureToggles[FEATURE_FLAG_NAMES.cernerTransition556T30]
        ? featureToggles[FEATURE_FLAG_NAMES.cernerTransition556T30]
        : false;
    },
    [featureToggles],
  );

  const isTranstioningFacility = useMemo(
    () => {
      const transitioningFacilities = [
        CernerTransitioningFacilities.NORTH_CHICAGO,
      ];
      if (!facilities) {
        return false;
      }
      return facilities?.some(facility =>
        transitioningFacilities.includes(parseInt(facility.facilityId, 10)),
      );
    },
    [facilities],
  );

  return (
    cernerTransition556T30 &&
    isTranstioningFacility && (
      <va-alert status="warning" class="vads-u-margin-top--2">
        <h2 slot="headline">
          New: Portions of My HealtheVet Transitioning to My VA Health
        </h2>
        <div>
          <p>
            Your VA health record or portions of it may be managed on My VA
            Health.{' '}
            <a href={mhvUrl(false, 'transitioning-to-my-va-health-learn-more')}>
              Learn more
            </a>{' '}
            about steps you may take in your My HealtheVet account, such as
            getting a list of scheduled appointments.
          </p>
          <p>
            Visit <strong>My VA Health</strong> at{' '}
            <a href={getCernerURL('')} rel="noreferrer" target="_blank">
              {getCernerURL('').split('?')[0]}
            </a>
            .
          </p>
        </div>
      </va-alert>
    )
  );
};

export default CernerTransitioningFacilityAlert;
