import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

export default function DowntimeMessage({ downtimeWindow }) {
  const endTime = downtimeWindow.endTime;
  let message = <p>We’re making some updates to this form. We’re sorry it’s not working right now. Please check back soon.</p>;
  if (endTime) {
    message = (
      <p>We’re making some updates to this form. We’re sorry it’s not working right now, and we hope to be finished by {endTime.format('MMMM Do, LT')}. Please check back soon.</p>
    );
  }

  return (
    <AlertBox
      headline="This form is down for maintenance."
      content={message}
      isVisible
      status="warning"/>
  );
}
