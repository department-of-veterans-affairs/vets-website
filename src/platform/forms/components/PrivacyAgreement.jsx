import PropTypes from 'prop-types';
import React from 'react';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function PrivacyAgreement({ onChange, checked, showError }) {
  return (
    <div>
      <VaCheckbox
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
        onVaChange={event => onChange(event.target.checked)}
      >
        <span slot="description">
          <a target="_blank" href="/privacy-policy/">
            View privacy policy
          </a>
        </span>
      </VaCheckbox>
    </div>
  );
}

PrivacyAgreement.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};
