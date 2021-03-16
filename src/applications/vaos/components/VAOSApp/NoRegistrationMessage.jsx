import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import FullWidthLayout from '../FullWidthLayout';

export default function NoRegistrationMessage() {
  return (
    <FullWidthLayout>
      <AlertBox
        status="error"
        headline="We’re sorry. We can’t find any VA medical facility registrations for you"
      >
        <p>
          To schedule an appointment online or to request Community Care
          assistance, you need to be:
        </p>
        <ol>
          <li>
            Enrolled in VA health care, <strong>and</strong>
          </li>
          <li>
            Registered with at least 1 VA medical center that accepts VA online
            scheduling
          </li>
        </ol>
        <p>
          To register with a facility, or if you think this message is an error,
          contact{' '}
          <a href="/find-locations">your local VA health care facility’s</a>{' '}
          registration office.
        </p>
      </AlertBox>
    </FullWidthLayout>
  );
}
