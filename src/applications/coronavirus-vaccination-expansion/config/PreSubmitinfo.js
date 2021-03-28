import React from 'react';

export default {
  required: true,
  notice: <></>,
  field: 'privacyAgreementAccepted',
  label: (
    <span>
      I certify that the information I have provided in this form is true and
      correct to the best of my knowledge and believf. I understand that it's a
      crime to provide information that you know is untrue or incorrect. Doing
      so could result in a fine or other penalty. I have read and accept the{' '}
      <a target="_blank" href="/privacy-policy/">
        privacy policy
      </a>
    </span>
  ),
  error: 'You must accept the privacy policy before continuing',
};
