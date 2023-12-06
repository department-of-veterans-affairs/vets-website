import React from 'react';
import PropTypes from 'prop-types';

import { requestStates } from 'platform/utilities/constants';

import useFacilitiesApi from './hooks/useFacilitiesApi';
import FacilityRadioBox from './FacilityRadioBox';

export default function PatientFacilities({ facilityIds, value, onChange }) {
  const [facilities, requestState] = useFacilitiesApi(facilityIds);

  switch (requestState) {
    case requestStates.pending: {
      return <va-loading-indicator message="Loading your facilities..." />;
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
        <va-alert visible status="error">
          <h3 slot="headline">We had trouble loading your VA locations</h3>
          An error occurred while trying to loading your locations. Please try
          again later.
        </va-alert>
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
