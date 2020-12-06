import React from 'react';
import PropTypes from 'prop-types';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { requestStates } from 'platform/utilities/constants';

import useFacilitiesApi from './hooks/useFacilitiesApi';

export default function PatientFacilities({ facilityIds, value, onChange }) {
  const [facilities, requestState] = useFacilitiesApi(facilityIds);

  switch (requestState) {
    case requestStates.pending: {
      return <LoadingIndicator message="Loading your facilities..." />;
    }
    case requestStates.succeeded: {
      return (
        <div>
          {facilities.map(facility => {
            const {
              id: facilityId,
              attributes: {
                name: facilityName,
                address: { physical: facilityAddress } = {},
              },
            } = facility;

            const checked = facilityId === value;

            return (
              <div className="form-radio-buttons" key={facilityId}>
                <input
                  type="radio"
                  name="facility"
                  checked={checked}
                  id={`radio-${facilityId}`}
                  value={facilityId}
                  onChange={() => onChange(facilityId)}
                />
                <label htmlFor={`radio-${facilityId}`}>
                  <span className="vads-u-display--block vads-u-font-weight--bold">
                    {facilityName}
                  </span>
                  <span className="vads-u-display--block vads-u-font-size--sm">
                    {facilityAddress?.city}, {facilityAddress?.state}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
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
