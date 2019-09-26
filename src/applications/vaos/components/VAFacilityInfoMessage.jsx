import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function VAFacilityInfoMessage({ facility }) {
  return (
    <AlertBox status="info" headline="We found one VA location for you">
      <p>
        <strong>{facility.institution.authoritativeName}</strong>
        <br />
        {facility.institution.city}, {facility.institution.stateAbbrev}
      </p>
      Not all VA locations offer all types of care or support online scheduling
      <p>
        If this location does not work for you, you can find a different
        location and call to schedule an appointment
      </p>
    </AlertBox>
  );
}
