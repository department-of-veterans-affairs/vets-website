import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const MPIConnectionError = () => {
  const content = (
    <p>
      We’re sorry. Something went wrong when we tried to connect to your Veteran
      records. Please refresh this page to try again.
    </p>
  );

  return (
    <div className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4">
      <AlertBox
        headline="We can’t access your Veteran records"
        content={content}
        status="warning"
      />
    </div>
  );
};

export default MPIConnectionError;
