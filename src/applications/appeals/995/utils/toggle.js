import React from 'react';
import { SC_NEW_FORM_DATA, HAS_REDIRECTED } from '../constants';

// All code in this file is temporary, and will be removed once the new form
// has been fully released

export const showScNewForm = formData => formData[SC_NEW_FORM_DATA];

export const UpdatedPagesAlert = () =>
  sessionStorage.getItem(HAS_REDIRECTED) === 'true' ? (
    <va-alert status="info">
      We updated the Supplemental Claim with new questions. Your previous
      responses have been saved. You’ll need to review your application in order
      to submit.
    </va-alert>
  ) : null;

export const checkRedirect = (formData, returnUrl) => {
  // veteran-information is the first page; housing-risk moved to second page
  if (!formData[HAS_REDIRECTED] && returnUrl !== '/veteran-information') {
    sessionStorage.setItem(HAS_REDIRECTED, 'true');
    return '/housing-risk';
  }
  return returnUrl;
};

export const clearRedirect = (formData, setFormData) => {
  if (!formData[HAS_REDIRECTED]) {
    setFormData({ ...formData, [HAS_REDIRECTED]: true });
    sessionStorage.removeItem(HAS_REDIRECTED);
  }
};
