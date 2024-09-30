import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';

const SecondaryRequiredAlert = () => {
  useEffect(() => {
    focusElement('.caregiver-error-message');
  }, []);

  return (
    <div className="caregiver-error-message vads-u-margin-bottom--4">
      <va-alert status="error">
        <h3 slot="headline">You need to add a Family Caregiver</h3>
        <p>
          Select <strong>Back</strong> to add a Primary Caregiver. Or change
          your response here to add a Secondary Caregiver.
        </p>
      </va-alert>
    </div>
  );
};

export default SecondaryRequiredAlert;
