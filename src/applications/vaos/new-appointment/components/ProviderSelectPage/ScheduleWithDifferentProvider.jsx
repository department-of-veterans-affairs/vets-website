import React from 'react';
import PropTypes from 'prop-types';
import OptionsForRequest from './OptionsForRequests';
import { getFacilityPhone } from '../../../services/location';

export default function ScheduleWithDifferentProvider({
  isEligibleForRequest,
  overRequestLimit,
  selectedFacility,
  hasProviders = true,
}) {
  const pageKey = 'selectProvider';
  const facilityPhone = getFacilityPhone(selectedFacility);

  if (overRequestLimit || !isEligibleForRequest) {
    return null;
  }

  return (
    <OptionsForRequest
      hasProviders={hasProviders}
      facilityName={selectedFacility.name}
      facilityPhone={facilityPhone}
      isEligibleForRequest={isEligibleForRequest || overRequestLimit}
      pageKey={pageKey}
    />
  );
}

ScheduleWithDifferentProvider.propTypes = {
  isEligibleForRequest: PropTypes.bool.isRequired,
  overRequestLimit: PropTypes.bool.isRequired,
  selectedFacility: PropTypes.object.isRequired,
  hasProviders: PropTypes.bool,
};
