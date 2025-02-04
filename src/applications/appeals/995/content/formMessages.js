import React from 'react';

export const saveInProgress = {
  messages: {
    inProgress:
      'Your VA Form 20-0995 (Supplemental Claim) application (20-0995) is in progress.',
    expired:
      'Your saved VA Form 20-0995 (Supplemental Claim) application (20-0995) has expired. If you want to apply for VA Form 20-0995 (Supplemental Claim), please start a new application.',
    saved:
      'Your VA Form 20-0995 (Supplemental Claim) application has been saved.',
  },
};

export const savedFormMessages = {
  notFound:
    'Please start over to apply for VA Form 20-0995 (Supplemental Claim).',
  noAuth:
    'Please sign in again to continue your application for VA Form 20-0995 (Supplemental Claim).',
};

export const UpdatedPagesAlert = (
  <va-alert status="info">
    We updated the Supplemental Claim with new questions. Your previous
    responses have been saved. You’ll need to review your application in order
    to submit.
  </va-alert>
);
