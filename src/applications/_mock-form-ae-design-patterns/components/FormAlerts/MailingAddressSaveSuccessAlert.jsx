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
      <h2 slot="headline">Your mailing address has been updated</h2>
      <p className="vads-u-margin-y--0">
        These changes have been saved to your profile.
      </p>
    </va-alert>
  );
};
