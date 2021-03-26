import React from 'react';

export const isTypeNone = formData => formData?.applicantType === 'none';

export const isVeteran = formData => formData?.applicantType === 'veteran';

export const consentLabel = (
  <span>I understand the above information and agree with these policies.</span>
);
export const consentError = (
  <span>You must accept the privacy policy before continuing</span>
);
export const consentNotice = (
  <span>
    This is the privacy policy and whatever else is required to agree to
  </span>
);
