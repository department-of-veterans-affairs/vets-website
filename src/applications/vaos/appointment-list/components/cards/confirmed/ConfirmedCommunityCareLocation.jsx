import React from 'react';
import FacilityAddress from '../../../../components/FacilityAddress';

export default function ConfirmedCommunityCareLocation({ appointment }) {
  const location = appointment.contained.find(
    res => res.resourceType === 'Location',
  );

  if (!location) {
    return null;
  }

  if (!location.address) {
    return (
      <dl className="vads-u-margin--0">
        <dt className="vads-u-font-weight--bold">{location.name}</dt>
        <dd>
          This appointment is scheduled with a community care provider. Please
          do not report to your local VA facility. If you have questions, please
          contact your facility community care staff at{' '}
          <a href="/find-locations" target="_blank" rel="noopener noreferrer">
            your local VA.
          </a>
          <br />
        </dd>
      </dl>
    );
  } else {
    return (
      <dl className="vads-u-margin--0">
        <dt className="vads-u-font-weight--bold">{location.name}</dt>
        <dd>
          <FacilityAddress facility={location} showDirectionsLink />
        </dd>
      </dl>
    );
  }
}
