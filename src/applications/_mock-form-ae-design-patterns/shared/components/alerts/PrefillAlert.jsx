import React from 'react';

export const PrefillAlert = ({
  willUpdateProfile = false,
  slim = false,
  level = 2,
}) => {
  const updateContent = willUpdateProfile
    ? 'All updates will be made to your profile.'
    : 'All updates will be made only to this form.';

  const H = `h${level}`;

  return (
    <va-alert slim={slim}>
      {!slim && <H slot="headline">We’ve prefilled some of your information</H>}
      <p className="vads-u-margin-y--0">
        We’ve prefilled some of your information from your account. If you need
        to correct anything, you can edit the form fields below. {updateContent}
      </p>
    </va-alert>
  );
};
