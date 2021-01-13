import React from 'react';
import { Link } from 'react-router-dom';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function NoVASystems() {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline="We can’t find a VA health system where you’re registered"
      >
        If you haven’t had an appointment at your local VA health facility,
        you’ll need to call the facility to schedule an appointment.{' '}
        <a href="/find-locations" target="_blank" rel="noopener noreferrer">
          Find a VA location
        </a>
        <p>
          <Link to="/">Go back to VA Online Scheduling home.</Link>
        </p>
      </AlertBox>
    </div>
  );
}
