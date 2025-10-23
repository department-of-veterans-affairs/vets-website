import React from 'react';
import State from '../../../components/State';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';

export default function SingleFacilityEligibilityCheckMessage({ facility }) {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <InfoAlert
        status="warning"
        headline="We found one VA location for you"
        level="2"
      >
        <p>
          <strong>{facility.name}</strong>
          <br />
          {facility.address?.city}, <State state={facility.address?.state} />
        </p>
        However, we couldn’t find any available slots right now.
        <p>
          If this location wasn’t what you were looking for, you can{' '}
          <NewTabAnchor href="/find-locations">
            search for a nearby location
          </NewTabAnchor>{' '}
          and call to schedule an appointment.
        </p>
      </InfoAlert>
    </div>
  );
}
