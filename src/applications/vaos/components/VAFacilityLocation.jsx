import React from 'react';
import { getRealFacilityId } from '../utils/appointment';
import FacilityAddress from './FacilityAddress';

export default function VAFacilityLocation({
  clinicName,
  facility,
  facilityName,
  facilityId,
  isHomepageRefresh,
}) {
  let content = null;

  if (!facility && !facilityId) {
    content = (
      <a href="/find-locations" rel="noopener noreferrer" target="_blank">
        Find facility information
      </a>
    );
  } else if (!facility) {
    content = (
      <a
        href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        View facility information
      </a>
    );
  } else if (facility) {
    content = (
      <>
        {!!clinicName && (
          <>
            {facility.name}
            <br />
          </>
        )}
        <FacilityAddress facility={facility} showDirectionsLink />
      </>
    );
  }

  const name = clinicName || facilityName || facility?.name;

  return (
    <>
      {!isHomepageRefresh && (
        <h4 className="vaos-appts__block-label">{name}</h4>
      )}
      {isHomepageRefresh && name}
      <div>{content}</div>
    </>
  );
}
