import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

export default function MissingVet360IDError() {
  return (
    <AlertBox
      isVisible
      status="info"
      content={
        <div>
          <h4>Contact information is coming soon</h4>
          <p>
            We’re working to give you access to review and edit your contact
            information. Please check back soon.
          </p>
        </div>
      }
    />
  );
}
