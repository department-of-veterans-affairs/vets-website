import React from 'react';
import FacilityAddress from './FacilityAddress';

export default function ConfirmedCommunityCareLocation({ appointment }) {
  const actor = appointment.contained[0]?.actor;

  if (!actor) {
    return null;
  }

  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">{actor.name}</dt>
      <dd>
        <FacilityAddress facility={actor} showDirectionsLink />
      </dd>
    </dl>
  );
}
