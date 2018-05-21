import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

export default function DowntimeBanner({ information, endTime }) {
  const content = (
    <div>
      <h3>We can’t show your {information} information right now</h3>
      <p>We’re sorry. The system that shows your {information} information is down for maintenance right now. We hope to be finished with our work by {endTime.format('LT')}. Please check back soon.</p>
    </div>
  );
  return (
    <AlertBox
      isVisible
      status="warning"
      content={content}/>
  );
}
