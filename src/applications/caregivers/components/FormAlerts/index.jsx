import React from 'react';

export const GeneralErrorAlert = () => (
  <va-alert
    status="error"
    class="caregivers-error-message vads-u-margin-top--4"
  >
    <h3 slot="headline">Something went wrong</h3>
    <p>We’re sorry. Something went wrong on our end. Please try again later.</p>
  </va-alert>
);
