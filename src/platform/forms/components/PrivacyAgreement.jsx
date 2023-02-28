import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

export default function PrivacyAgreement({ onChange, checked, showError }) {
  useEffect(() => {
    const selector = 'va-checkbox[name="privacyAgreement"]';
    const element = document.querySelector(selector);
    element.addEventListener('vaChange', event => {
      onChange(event.target.checked);
    });
  });

  return (
    <div>
      <va-checkbox
        required
        checked={checked}
        name="privacyAgreement"
        error={
          showError && !checked
            ? 'You must accept the privacy policy before continuing.'
            : undefined
        }
        label="I have read and accept the privacy policy"
        description={null}
      >
        <span slot="description">
          <a target="_blank" href="/privacy-policy/">
            View privacy policy
          </a>
        </span>
      </va-checkbox>
    </div>
  );
}

PrivacyAgreement.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};
