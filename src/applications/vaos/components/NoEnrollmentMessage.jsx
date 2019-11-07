import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function NoEnrollmentMessage() {
  return (
    <AlertBox
      status="error"
      headline="We’re sorry. We can’t find a record of your VA health care enrollment"
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
        <a href="/health-care/apply">
          Find out how to apply for VA health care benefits
        </a>
      </p>
    </AlertBox>
  );
}
