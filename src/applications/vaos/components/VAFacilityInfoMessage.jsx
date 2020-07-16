import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function VAFacilityInfoMessage({ facility }) {
  return (
    <AlertBox status="info" headline="We found one VA location for you">
      <p>
        <strong>{facility.name}</strong>
        <br />
        {facility.address?.city}, {facility.address?.state}
      </p>
      Not all VA locations offer all types of care or support online scheduling.
      <p>
        If this location wasn't what you were looking for, you can{' '}
        <a href="/find-locations" target="_blank" rel="noopener noreferrer">
          search for a nearby location
        </a>{' '}
        and call to schedule an appointment.
      </p>
    </AlertBox>
  );
}
