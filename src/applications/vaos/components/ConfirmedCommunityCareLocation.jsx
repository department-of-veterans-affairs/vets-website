import React from 'react';
import FacilityDirectionsLink from './FacilityDirectionsLink';

export default function ConfirmedCommunityCareLocation({ appointment }) {
  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">
        {appointment.providerPractice}
      </dt>
      <dd>
        {appointment.address.street}
        <br />
        {appointment.address.city}, {appointment.address.state}{' '}
        {appointment.address.zipCode}
        <br />
        <FacilityDirectionsLink location={appointment} />
      </dd>
    </dl>
  );
}
