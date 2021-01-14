import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function VAFacilityInfoMessage({ facility }) {
  return (
    <AlertBox
      status="info"
      headline="We found one facility that accepts online scheduling for this care"
    >
      <p>
        <strong>{facility.name}</strong>
        <br />
        {facility.address?.city}, {facility.address?.state}
      </p>
      <p>
        Not all VA facilities offer online scheduling for all types of care. If
        this isn’t the facility you’re looking for, you can{' '}
        <a href="/find-locations" target="_blank" rel="noopener noreferrer">
          search for another VA facility
        </a>
        .
      </p>
    </AlertBox>
  );
}
