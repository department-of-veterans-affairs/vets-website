import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';

const SecondaryRequiredAlert = () => {
  useEffect(() => {
    focusElement('va-alert[status="error"]');
  }, []);

  return (
    <va-alert status="error" class="vads-u-margin-bottom--4">
      <h3 slot="headline">You need to add a Family Caregiver</h3>
      <p>
        Select <strong>Back</strong> to add a Primary Caregiver. Or change your
        response here to add a Secondary Caregiver.
      </p>
    </va-alert>
  );
};

export default React.memo(SecondaryRequiredAlert);
