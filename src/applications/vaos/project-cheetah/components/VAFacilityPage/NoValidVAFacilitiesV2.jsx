import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function NoValidVAFacilities() {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline={`We can’t find a VA facility where you receive care that accepts online appointments for project cheetah`}
        content={
          <>
            <p>
              You’ll need to call your local VA medical center to schedule this
              appointment.{' '}
              <NewTabAnchor
                href="/find-locations"
                anchorText="Find a VA location"
              />
            </p>
            <p>
              To request another online appointment, please go back and choose a
              different type of care.
            </p>
          </>
        }
      />
    </div>
  );
}
