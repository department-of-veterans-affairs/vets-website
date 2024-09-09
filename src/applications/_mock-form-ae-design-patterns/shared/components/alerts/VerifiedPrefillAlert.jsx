import React from 'react';

const VerifiedPrefillAlert = (
  <va-alert
    status="info"
    class="vads-u-margin-y--2"
    data-testid="ezr-verified-prefill-alert"
    slim
    uswds
  >
    <div>
      <strong>Note:</strong> Since you’re signed in to your account, we can
      prefill part of your form based on your account details. You can also save
      your form in progress and come back later to finish filling it out.
    </div>
  </va-alert>
);

export default VerifiedPrefillAlert;
