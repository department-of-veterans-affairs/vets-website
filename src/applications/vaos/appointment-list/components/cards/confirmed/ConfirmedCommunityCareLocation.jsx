import React from 'react';
import FacilityAddress from '../../../../components/FacilityAddress';
import NewTabAnchor from '../../../../components/NewTabAnchor';

export default function ConfirmedCommunityCareLocation({ appointment }) {
  const location = appointment.contained.find(
    res => res.resourceType === 'Location',
  );

  if (!location) {
    return null;
  }

  if (!location.address) {
    return (
      <>
        {!!location.name && (
          <h4 className="vaos-appts__block-label">{location.name}</h4>
        )}
        <div>
          This appointment is scheduled with a community care provider. Please
          do not report to your local VA facility. If you have questions, please
          contact your facility community care staff at{' '}
          <NewTabAnchor href="/find-locations">your local VA.</NewTabAnchor>
          <br />
        </div>
      </>
    );
  } else {
    return (
      <>
        <h4 className="vaos-appts__block-label">{location.name}</h4>
        <div>
          <FacilityAddress facility={location} showDirectionsLink />
        </div>
      </>
    );
  }
}
