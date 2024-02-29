import React from 'react';

export const GeneralErrorAlert = () => (
  <div className="caregivers-error-message vads-u-margin-top--4">
    <va-alert status="error">
      <h3 slot="headline">Something went wrong</h3>
      <p>
        We’re sorry. Something went wrong on our end. Please try again later.
      </p>
    </va-alert>
  </div>
);

export const SecondaryRequiredAlert = () => (
  <va-alert status="error">
    <h3 slot="headline">We need you to add a Family Caregiver</h3>
    <p>
      We can’t process your application unless you add a Family Caregiver.
      Please go back and add either a Primary or Secondary Family Caregiver to
      your application.
    </p>
  </va-alert>
);
