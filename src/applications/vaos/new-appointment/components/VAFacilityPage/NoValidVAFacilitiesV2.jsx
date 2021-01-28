import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export default function NoValidVAFacilities() {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline={`Your registered facilities don’t accept online scheduling for this care right now`}
        content={
          <>
            <p>
              You’ll need to call your local VA health facility to schedule this
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
              To request another appointment online, please go back and choose a
              different type of care.
            </p>
          </>
        }
      />
    </div>
  );
}
