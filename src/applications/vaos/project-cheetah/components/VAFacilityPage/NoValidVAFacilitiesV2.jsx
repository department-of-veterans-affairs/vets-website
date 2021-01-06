import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

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
              <a
                href="/find-locations"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find a VA location
              </a>
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
