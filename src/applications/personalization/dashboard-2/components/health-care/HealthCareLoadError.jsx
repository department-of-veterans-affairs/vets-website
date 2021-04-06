import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const HealthCareLoadError = () => {
  const alertMessage = (
    <p>
      We’re sorry. Something went wrong on our end and we couldn't access your
      health care information. Please refresh or try again later.
    </p>
  );

  return (
    <div className="load-error">
      <AlertBox
        headline="We couldn’t retrieve your health care information"
        content={alertMessage}
        status="error"
      />
    </div>
  );
};

export default HealthCareLoadError;
