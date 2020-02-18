import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

export default function PrivacyAgreement(props) {
  const { showError } = props;
  const [checked, setCheck] = useState(false);
  return (
    <div>
      <ErrorableCheckbox
        required
        checked={checked}
        onValueChange={setCheck}
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
  showError: PropTypes.bool,
};
