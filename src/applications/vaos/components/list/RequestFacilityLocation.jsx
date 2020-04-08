import React from 'react';
import { getRealFacilityId } from '../../utils/appointment';
import FacilityAddress from '../FacilityAddress';

export default function RequestFacilityLocation({ facility, facilityId }) {
  if (facility) {
    return <FacilityAddress facility={facility} showDirectionsLink />;
  }

  return (
    <a
      href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      View facility information
    </a>
  );
}
