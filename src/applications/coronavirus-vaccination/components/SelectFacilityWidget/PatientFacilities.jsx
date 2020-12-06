import React from 'react';
import PropTypes from 'prop-types';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { requestStates } from 'platform/utilities/constants';

import useFacilitiesApi from './hooks/useFacilitiesApi';

export default function PatientFacilities({ patientFacilityIds }) {
  const [facilities, requestState] = useFacilitiesApi(patientFacilityIds);

  switch (requestState) {
    case requestStates.pending: {
      return <LoadingIndicator message="Loading your facilities..." />;
    }
    case requestStates.succeeded: {
      return <code>{JSON.stringify(facilities)}</code>;
    }
    case requestStates.failed: {
      return (
        <AlertBox
          status={ALERT_TYPE.ERROR}
          headline="We had trouble loading your VA locations"
          content="An error occurred while trying to loading your locations. Please try again later."
        />
      );
    }
    case requestStates.notCalled:
    default: {
      return null;
    }
  }
}

PatientFacilities.propTypes = {
  facilityIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};
