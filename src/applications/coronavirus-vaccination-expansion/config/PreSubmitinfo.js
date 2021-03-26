import React from 'react';

export default {
  required: true,
  notice: <></>,
  field: 'privacyAgreementAccepted',
  label: (
    <span>
      I have read and accept the{' '}
      <a target="_blank" href="/privacy-policy/">
        privacy policy
      </a>
    </span>
  ),
  error: 'You must accept the privacy policy before continuing',
};
