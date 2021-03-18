import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function NoValidVAFacilities() {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline={`We couldn’t find a VA facility where you receive care that accepts online appointments for COVID-19 vaccines`}
        content={
          <>
            <p>
              You’ll need to call your local VA medical center to schedule this
              appointment.{' '}
              <NewTabAnchor href="/find-locations">
                Find a VA location
              </NewTabAnchor>
            </p>
          </>
        }
      />
    </div>
  );
}
