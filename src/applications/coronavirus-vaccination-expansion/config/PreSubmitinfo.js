import React from 'react';

// Law cite language if needed: U.S. federal laws 18 USC 287 and 1001
export default {
  required: true,
  notice: <></>,
  field: 'privacyAgreementAccepted',
  label: (
    <span>
      I certify that the information I’ve provided in this form is true and
      correct to the best of my knowledge and belief. I understand that it's a
      crime to provide information that I know is untrue or incorrect. I
      understand that doing so could result in a fine or other penalty. I have
      also read and accept the{' '}
      <a target="_blank" href="/privacy-policy/">
        privacy policy.
      </a>
    </span>
  ),
  error: 'You must agree to the statement before continuing',
};
