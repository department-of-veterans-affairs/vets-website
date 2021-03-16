import PropTypes from 'prop-types';
import React from 'react';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

export default function PrivacyAgreement({ onChange, checked, showError }) {
  return (
    <div>
      <Checkbox
        required
        checked={checked}
        onValueChange={onChange}
        name="privacyAgreement"
        errorMessage={
          showError && !checked
            ? 'You must accept the privacy policy before continuing.'
            : undefined
        }
        label={
          <span>
            I have read and accept the{' '}
            <a target="_blank" href="/privacy-policy/">
              privacy policy
            </a>
          </span>
        }
      />
    </div>
  );
}

PrivacyAgreement.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};
