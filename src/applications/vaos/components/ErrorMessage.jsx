import React from 'react';

import InfoAlert from '../components/InfoAlert';

export default function ErrorMessage({ level }) {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <InfoAlert
        status="error"
        level={level}
        headline="We’re sorry. We’ve run into a problem"
      >
        Something went wrong on our end. Please try again later.
      </InfoAlert>
    </div>
  );
}
