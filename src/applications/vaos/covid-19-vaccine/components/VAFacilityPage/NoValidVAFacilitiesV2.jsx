import React from 'react';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';

export default function NoValidVAFacilities() {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <InfoAlert
        status="warning"
        headline="We couldn’t find a VA facility where you receive care that accepts online appointments for COVID-19 vaccines"
      >
        <p>
          You’ll need to call your local VA medical center to schedule this
          appointment.{' '}
          <NewTabAnchor href="/find-locations">Find a VA location</NewTabAnchor>
        </p>
      </InfoAlert>
    </div>
  );
}
