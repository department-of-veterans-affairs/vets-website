import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import State from '../../../components/State';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function VAFacilityInfoMessage({ facility }) {
  return (
    <AlertBox
      status="info"
      headline="We found one VA location for you"
      level="2"
    >
      <p>
        <strong>{facility.name}</strong>
        <br />
        {facility.address?.city}, <State state={facility.address?.state} />
      </p>
      Not all VA locations offer all types of care or support online scheduling.
      <p>
        If this location wasn't what you were looking for, you can{' '}
        <NewTabAnchor href="/find-locations">
          search for a nearby location
        </NewTabAnchor>{' '}
        and call to schedule an appointment.
      </p>
    </AlertBox>
  );
}
