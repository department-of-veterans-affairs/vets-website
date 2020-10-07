import React from 'react';
import FacilityAddress from '../../../../components/FacilityAddress';

export default function AtlasLocation({ appointment }) {
  const vvsAppointment = appointment.legacyVAR.apiData.vvsAppointments[0];
  const address = vvsAppointment.tasInfo.address;
  const name = `ATLAS facility in ${address.city}, ${address.state}`;
  const facility = {
    name,
    address: {
      ...address,
      line: [address.streetAddress],
      postalCode: address.zipCode,
    },
  };

  return (
    <div>
      <FacilityAddress facility={facility} showDirectionsLink />
      <div className="vads-u-font-weight--bold vads-u-margin-top--2">
        Appointment code: {vvsAppointment.tasInfo.confirmationCode}
      </div>
      <span>
        You will use this code to find your appointment using the computer
        provided at the site.
      </span>
    </div>
  );
}
