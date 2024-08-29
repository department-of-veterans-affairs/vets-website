import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';

const SecondaryRequiredAlert = () => {
  useEffect(() => {
    focusElement('.caregiver-error-message');
  }, []);

  return (
    <div className="caregiver-error-message">
      <va-alert status="error">
        <h3 slot="headline">You need to add or change a Family Caregiver</h3>
        <p>
          You didn’t add or change a Primary or Secondary Family Caregiver in
          this application.
        </p>
        <p>
          Select <strong>Back</strong> to add a Primary Caregiver. Or change
          your response here to add a Secondary Caregiver.
        </p>
      </va-alert>
    </div>
  );
};

export default SecondaryRequiredAlert;
