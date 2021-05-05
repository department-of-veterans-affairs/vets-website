import React from 'react';
import { Link } from 'react-router-dom';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function NoVASystems() {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline="We can’t find a VA health system where you’re registered"
      >
        If you haven’t had an appointment at your local VA health facility,
        you’ll need to call the facility to schedule an appointment.{' '}
        <NewTabAnchor href="/find-locations">Find a VA location</NewTabAnchor>
        <p>
          <Link to="/">Go back to VA Online Scheduling home.</Link>
        </p>
      </AlertBox>
    </div>
  );
}
