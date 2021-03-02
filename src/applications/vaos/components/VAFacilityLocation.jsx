import React from 'react';
import { getRealFacilityId } from '../utils/appointment';
import FacilityAddress from './FacilityAddress';
import NewTabAnchor from './NewTabAnchor';

export default function VAFacilityLocation({
  clinicName,
  facility,
  facilityName,
  facilityId,
  isHomepageRefresh,
  clinicFriendlyName,
}) {
  let content = null;

  if (!facility && !facilityId) {
    content = (
      <NewTabAnchor
        href="/find-locations"
        anchorText="Find facility information"
      />
    );
  } else if (!facility) {
    content = (
      <NewTabAnchor
        href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
        anchorText="View facility information"
      />
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
        <FacilityAddress
          facility={facility}
          showDirectionsLink
          clinicName={clinicFriendlyName}
          level={isHomepageRefresh ? 2 : 4}
        />
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
