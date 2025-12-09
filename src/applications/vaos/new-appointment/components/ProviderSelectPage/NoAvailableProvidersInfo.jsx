import React from 'react';
import PropTypes from 'prop-types';
import FacilityPhone from '../../../components/FacilityPhone';
import { getFacilityPhone } from '../../../services/location';

function NoAvailableProvidersInfo({
  isEligibleForRequest,
  overRequestLimit,
  selectedFacility,
  typeOfCareName,
}) {
  const needsExtraInfo = !isEligibleForRequest || overRequestLimit;
  const facilityPhone = getFacilityPhone(selectedFacility);

  const extraText = needsExtraInfo
    ? ' You can call the facility to schedule.'
    : null;
  return (
    <>
      <p data-testid="no-available-provider-intro">
        We need additional information before you can schedule appointments for{' '}
        {typeOfCareName.toLowerCase().trim()} at this facility online.
        {extraText}
      </p>
      {needsExtraInfo ? (
        <div data-testid="no-available-provider-extra">
          <strong>{selectedFacility.name}</strong>
          <p className="vads-u-margin-y--0">
            <strong>Main phone: </strong>
            <FacilityPhone contact={facilityPhone} icon={false} />
          </p>
        </div>
      ) : null}
    </>
  );
}

NoAvailableProvidersInfo.propTypes = {
  isEligibleForRequest: PropTypes.bool,
  overRequestLimit: PropTypes.bool,
  selectedFacility: PropTypes.object,
  typeOfCareName: PropTypes.string,
};

export default NoAvailableProvidersInfo;
