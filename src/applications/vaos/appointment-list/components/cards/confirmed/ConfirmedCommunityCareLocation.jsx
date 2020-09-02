import React from 'react';
import FacilityAddress from '../../../../components/FacilityAddress';

export default function ConfirmedCommunityCareLocation({ appointment }) {
  const location = appointment.contained.find(
    res => res.resourceType === 'Location',
  );

  if (!location) {
    return null;
  }

  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">{location.name}</dt>
      <dd>
        <FacilityAddress
          facility={location}
          showDirectionsLink={location.address ? true : false}
        />
      </dd>
    </dl>
  );
}
