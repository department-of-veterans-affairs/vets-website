import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export const fieldFailureMessage = (
  <span>
    We’re sorry. We can’t access this information right now. Please refresh the
    page or try again.
  </span>
);

export default function LoadFail({ information }) {
  return (
    <AlertBox
      isVisible
      headline={`We can’t access your ${information} information right now.`}
      status="warning"
      content={
        <p>
          We’re sorry. Something went wrong on our end. Please refresh this page
          or try again later.
        </p>
      }
    />
  );
}
