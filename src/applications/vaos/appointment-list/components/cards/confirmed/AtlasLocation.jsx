import React from 'react';
import FacilityAddress from '../../../../components/FacilityAddress';

export default function AtlasLocation({ appointment }) {
  const { address } = appointment.videoData.atlasLocation;
  const { city, state } = address;
  const confirmationCode = appointment.videoData.atlasConfirmationCode;

  const name = `ATLAS facility in ${city}, ${state}`;
  const facility = {
    name,
    address,
  };

  return (
    <div>
      <FacilityAddress facility={facility} showDirectionsLink />
      <h4 className="vaos-appts__block-label vads-u-margin-top--2">
        Appointment code: {confirmationCode}
      </h4>
      <span>
        You will use this code to find your appointment using the computer
        provided at the site.
      </span>
    </div>
  );
}
