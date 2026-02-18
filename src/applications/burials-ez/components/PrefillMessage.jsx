import React from 'react';

const PrefillMessage = () => (
  <va-alert close-btn-aria-label="Close notification" status="info" visible>
    <p className="vads-u-margin-y--0">
      We’ve prefilled some of your information from your account. If you need to
      correct anything, you can edit the form fields below.
    </p>
  </va-alert>
);

export default PrefillMessage;
