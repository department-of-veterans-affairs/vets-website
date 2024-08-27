import React, { useEffect } from 'react';

export const MailingAddressSaveSuccessAlert = () => {
  useEffect(() => {
    window.sessionStorage.removeItem('onReviewPageContactInfoEdit');
    return () => {
      window.sessionStorage.removeItem('onReviewPageContactInfoEdit');
    };
  }, []);
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="success"
      visible
    >
      <h2 slot="headline">We’ve updated your mailing address</h2>
      <p className="vads-u-margin-y--0">
        We’ve also made these changes in your VA.gov profile.
      </p>
    </va-alert>
  );
};
