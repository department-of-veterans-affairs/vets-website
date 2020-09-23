import React from 'react';
import FacilityAddress from '../../../../components/FacilityAddress';

export default function AtlasLocation({ appointment }) {
  const vvsAppointment = appointment.legacyVAR.apiData.vvsAppointments[0];
  const name = `ATLAS facility in ${vvsAppointment.tasInfo.address.city}, ${
    vvsAppointment.tasInfo.address.state
  }`;
  const facility = {
    name,
    address: {
      ...vvsAppointment.tasInfo.address,
      line: [vvsAppointment.tasInfo.address.streetAddress],
      postalCode: vvsAppointment.tasInfo.address.zipCode,
    },
  };

  return (
    <div>
      <FacilityAddress facility={facility} showDirectionsLink />
      <div className="vads-u-font-weight--bold vads-u-margin-top--2">
        Appointment code:{' '}
        {
          appointment.legacyVAR.apiData.vvsAppointments[0].tasInfo
            .confirmationCode
        }
      </div>
      <span>
        You will use this code to find your appointment using the computer
        provided at the site.
      </span>
    </div>
  );
}
