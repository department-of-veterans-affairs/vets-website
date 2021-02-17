import React from 'react';
import FacilityAddress from '../../../components/FacilityAddress';
import {
  getATLASConfirmationCode,
  getATLASLocation,
} from '../../../services/appointment';

export default function AtlasLocation({ appointment }) {
  const { address } = getATLASLocation(appointment);
  const { city, state } = address;
  const confirmationCode = getATLASConfirmationCode(appointment);

  const name = `ATLAS facility in ${city}, ${state}`;
  const facility = {
    name,
    address,
  };

  return (
    <div>
      <FacilityAddress facility={facility} showDirectionsLink />
      <h3 className="vaos-appts__block-label vads-u-margin-top--2">
        Appointment code: {confirmationCode}
      </h3>
      <span>
        You will use this code to find your appointment using the computer
        provided at the site.
      </span>
    </div>
  );
}
