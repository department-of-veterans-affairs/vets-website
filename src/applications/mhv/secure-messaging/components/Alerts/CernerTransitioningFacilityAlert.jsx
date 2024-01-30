import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const CernerTransitioningFacilityAlert = props => {
  const { recipients } = props;

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
