import React from 'react';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox.jsx';

export default function PrivacyAgreement({ onChange, checked, showError }) {
  return (
    <div>
      <ErrorableCheckbox required
          checked={checked}
          onValueChange={onChange}
          name="privacyAgreement"
          errorMessage={showError && !checked ? 'You must accept the privacy policy before continuing' : undefined}
          label={<span>I have read and accept the <a target="_blank" href="/privacy">privacy policy</a></span>}/>
    </div>
  );
}

PrivacyAgreement.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  checked: React.PropTypes.bool.isRequired
};
