import React from 'react';

const GeneralErrorAlert = () => (
  <div className="caregivers-error-message vads-u-margin-top--4">
    <va-alert status="error" uswds>
      <h3 slot="headline">Something went wrong</h3>
      <p>
        We’re sorry. Something went wrong on our end. Please try again later.
      </p>
    </va-alert>
  </div>
);

export default GeneralErrorAlert;
