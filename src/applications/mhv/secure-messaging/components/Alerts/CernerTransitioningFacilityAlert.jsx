import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import { getCernerURL } from '~/platform/utilities/cerner';

const CernerTransitioningFacilityAlert = props => {
  const { recipients } = props;
  const cernerTransition556T30 = useSelector(
    state => state.featureToggles[FEATURE_FLAG_NAMES.cernerTransition556T30],
  );

  const isTranstioningFacility = useMemo(
    () => {
      const transitioningFacilities = [556];

      return recipients.some(recipient =>
        transitioningFacilities.includes(parseInt(recipient.stationNumber, 10)),
      );
    },
    [recipients],
  );

  return (
    cernerTransition556T30 &&
    isTranstioningFacility && (
      <va-alert status="warning">
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

CernerTransitioningFacilityAlert.propTypes = {
  recipients: PropTypes.array.isRequired,
};

export default CernerTransitioningFacilityAlert;
