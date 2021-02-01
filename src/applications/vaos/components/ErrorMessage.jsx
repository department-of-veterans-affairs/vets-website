import React from 'react';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export default function ErrorMessage({ level }) {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="error"
        level={level}
        headline="We’re sorry. We’ve run into a problem"
      >
        Something went wrong on our end. Please try again later.
      </AlertBox>
    </div>
  );
}
