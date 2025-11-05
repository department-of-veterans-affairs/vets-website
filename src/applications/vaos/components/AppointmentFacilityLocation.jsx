import React from 'react';
import PropTypes from 'prop-types';
import ProviderAddress from '../referral-appointments/components/ProviderAddress';
import FacilityPhone from './FacilityPhone';

export default function AppointmentFacilityLocation({
  locationName,
  locationAddress,
  locationPhone,
}) {
  return (
    <>
      {locationName ? (
        <p
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
          data-dd-privacy="mask"
        >
          {locationName}
        </p>
      ) : (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          Facility name not available
        </p>
      )}
      {locationAddress ? (
        <ProviderAddress
          address={locationAddress}
          showDirections
          directionsName={locationName || 'Facility'}
        />
      ) : (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          Address not available
        </p>
      )}
      <FacilityPhone
        // If provider phone is available, use it, otherwise VA 800 number
        contact={locationPhone || undefined}
        // If provider phone is available, hide extension
        ccPhone={!!locationPhone}
      />
    </>
  );
}

AppointmentFacilityLocation.propTypes = {
  locationAddress: PropTypes.string,
  locationName: PropTypes.string,
  locationPhone: PropTypes.string,
};
