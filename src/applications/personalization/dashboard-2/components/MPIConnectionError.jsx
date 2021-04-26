import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const MPIConnectionError = () => {
  const alertMessage = (
    <p>
      We’re sorry. Something went wrong when we tried to connect to your
      records. Please refresh or try again later.
    </p>
  );

  return (
    <AlertBox
      headline="We can’t access any health care, claims, or appeals information right now"
      content={alertMessage}
      status="error"
    />
  );
};

export default MPIConnectionError;
