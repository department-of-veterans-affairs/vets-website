import React from 'react';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox.jsx';

export default function PrivacyAgreement({ onChange, checked }) {
  return (
    <div>
      <ErrorableCheckbox required
          checked={checked}
          onValueChange={onChange}
          label={<span>I have read and accept the <a href="/privacy-policy">privacy policy</a></span>}/>
    </div>
  );
}

PrivacyAgreement.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  checked: React.PropTypes.bool.isRequired
};
