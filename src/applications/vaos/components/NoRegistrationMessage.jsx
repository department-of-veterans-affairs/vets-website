import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function NoRegistrationMessage() {
  return (
    <AlertBox
      status="error"
      headline="Sorry, we couldn’t find any VHA facility registrations for you"
    >
      <p>
        To use this app to schedule or request an appointment at a VA facility,
        or to request community care assistance, you need to be:
      </p>
      <ol>
        <li>Actively enrolled in VA health care, and</li>
        <li>Registered with a VA health care facility</li>
      </ol>
      <p>
        If you need to register, or you believe this is an error, please contact
        your{' '}
        <a href="/find-locations" target="_blank" rel="noopener noreferrer">
          local facility's
        </a>{' '}
        registration office.
      </p>
    </AlertBox>
  );
}
