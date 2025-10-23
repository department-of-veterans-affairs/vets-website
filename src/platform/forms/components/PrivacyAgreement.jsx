import PropTypes from 'prop-types';
import React from 'react';
import { VaPrivacyAgreement } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function PrivacyAgreement({ onChange, checked, showError }) {
  return (
    <div>
      <VaPrivacyAgreement
        checked={checked}
        showError={showError && !checked}
        onVaChange={event => onChange(event.target.checked)}
      />
    </div>
  );
}

PrivacyAgreement.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};
