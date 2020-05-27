import React from 'react';
import FacilityDirectionsLink from './FacilityDirectionsLink';

export default function ConfirmedCommunityCareLocation({ appointment }) {
  const address = appointment.contained[0]?.actor?.address;

  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">
        {appointment.contained[0]?.actor?.name}
      </dt>
      <dd>
        {address.line[0]}
        <br />
        {address.city}, {address.state} {address.postalCode}
        <br />
        <FacilityDirectionsLink location={appointment} />
      </dd>
    </dl>
  );
}
