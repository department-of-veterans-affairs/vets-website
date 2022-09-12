import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

export default function PrivacyAgreement({
  onChange,
  checked,
  required,
  showError,
}) {
  return (
    <div>
      <Checkbox
        required={required}
        checked={checked}
        onValueChange={onChange}
        name="privacyAgreement"
        errorMessage={
          showError && !checked
            ? 'You must accept the privacy policy before continuing.'
            : undefined
        }
        label={
          // Getting conflicting linting issues here.
          // eslint-disable-next-line react/jsx-wrap-multilines
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
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  showError: PropTypes.bool,
};
