import React from 'react';

const SecondaryRequiredAlert = () => (
  <va-alert status="error" uswds>
    <h3 slot="headline">We need you to add a Family Caregiver</h3>
    <p>
      We can’t process your application unless you add a Family Caregiver.
      Please go back and add either a Primary or Secondary Family Caregiver to
      your application.
    </p>
  </va-alert>
);

export default SecondaryRequiredAlert;
