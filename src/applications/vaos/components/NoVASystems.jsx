import React from 'react';
import { Link } from 'react-router';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function NoVASystems() {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline="Sorry, we couldn't find any VA health systems you've been seen at."
      >
        You may need to call to make an appointment at your{' '}
        <a href="/find-locations" target="_blank" rel="noopener noreferrer">
          local VA medical center
        </a>{' '}
        if you have not been seen there before.
        <p>
          <Link to="/">Go back to VA Online Scheduling home.</Link>
        </p>
      </AlertBox>
    </div>
  );
}
