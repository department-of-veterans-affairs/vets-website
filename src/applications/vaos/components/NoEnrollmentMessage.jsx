import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function NoEnrollmentMessage() {
  return (
    <AlertBox
      status="error"
      headline="Sorry, we couldn’t find a record of your enrollment with the Veterans Health Administration"
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
        <a href="/health-care/apply">
          Learn more about applying for VA health care
        </a>
      </p>
    </AlertBox>
  );
}
