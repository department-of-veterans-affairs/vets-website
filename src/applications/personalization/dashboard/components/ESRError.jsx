import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

/**
 * Error message to show on the Dashboard if there is an error connecting to ESR
 * via the enrollment_status endpoint
 */
const ESRError = () => (
  <AlertBox
    content={
      <p>
        We are having trouble loading health care information right now. Blah
        blah blah...
      </p>
    }
    headline="We are currently unable to show health care information"
    status="error"
  />
);

export default ESRError;
