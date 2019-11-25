import React from 'react';
import { Link } from 'react-router';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function NoValidVAFacilities({ systemId }) {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline="Sorry, we couldn't find any locations for you"
      >
        Some types of care are not available at certain VA locations and not all
        VA locations have enabled online scheduling. You can choose a different
        VA health system or{' '}
        <a
          href={`/find-locations/facility/vha_${systemId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          contact the VA medical center you chose
        </a>{' '}
        to get help with the care you need.
        <p>
          <Link to="/">Go back to VA Online Scheduling home.</Link>
        </p>
      </AlertBox>
    </div>
  );
}
