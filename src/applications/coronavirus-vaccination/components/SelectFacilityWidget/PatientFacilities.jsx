import React from 'react';
import PropTypes from 'prop-types';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { requestStates } from 'platform/utilities/constants';

import useFacilitiesApi from './hooks/useFacilitiesApi';
import FacilityRadioBox from './FacilityRadioBox';

export default function PatientFacilities({ facilityIds, value, onChange }) {
  const [facilities, requestState] = useFacilitiesApi(facilityIds);

  switch (requestState) {
    case requestStates.pending: {
      return <LoadingIndicator message="Loading your facilities..." />;
    }
    case requestStates.succeeded: {
      return (
        <>
          {facilities.map(facility => {
            return (
              <FacilityRadioBox
                key={facility.id}
                facility={facility}
                selectedFacilityId={value}
                onFacilitySelected={onChange}
              />
            );
          })}
        </>
      );
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
