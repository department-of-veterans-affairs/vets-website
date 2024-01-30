import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

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
        <h2 slot="headline">Cerner Transition Alert</h2>
        <div>
          <p>This facility will be transitioning to Cerner</p>
        </div>
      </va-alert>
    )
  );
};

CernerTransitioningFacilityAlert.propTypes = {
  recipients: PropTypes.array.isRequired,
};

export default CernerTransitioningFacilityAlert;
