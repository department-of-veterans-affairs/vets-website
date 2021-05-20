import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import State from '../../../components/State';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function SingleFacilityEligibilityCheckMessage({ facility }) {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
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
      </AlertBox>
    </div>
  );
}
