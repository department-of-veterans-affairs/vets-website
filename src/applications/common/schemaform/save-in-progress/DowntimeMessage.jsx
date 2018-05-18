import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

export default function DowntimeMessage() {
  return (
    <AlertBox
      headline="This application is down for maintenance."
      content="We’re sorry. This application is currently down while we fix a few things. We’ll be back up as soon as we can."
      isVisible
      status="warning"/>
  );
}
