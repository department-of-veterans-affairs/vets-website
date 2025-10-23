import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';

const AuthenticatedShortFormAlert = () => {
  // use logging to compare number of short forms started vs completed
  useEffect(() => {
    recordEvent({
      event: 'hca-short-form-flow',
    });
  }, []);

  return (
    <va-alert-expandable
      trigger="You can fill out a shorter application"
      status="success"
    >
      Your service-connected disability rating is 50% or higher. This means that
      you meet one of our eligibility criteria.
    </va-alert-expandable>
  );
};

export default AuthenticatedShortFormAlert;
