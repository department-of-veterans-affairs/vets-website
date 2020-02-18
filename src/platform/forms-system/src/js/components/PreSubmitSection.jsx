import PropTypes from 'prop-types';
import React from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

export function PreSubmitSection({
  onChange,
  showError,
  preSubmitInfo,
  checked,
  formData,
}) {
  const PrivacyAgreementTemplate = () => (
    <div>
      {preSubmitInfo.notice}
      {preSubmitInfo.required && (
        <ErrorableCheckbox
          required
          checked={checked}
          onValueChange={onChange}
          name={preSubmitInfo.field}
          errorMessage={
            showError && !checked
              ? preSubmitInfo.error || 'Please accept'
              : undefined
          }
          label={preSubmitInfo.label}
        />
      )}
    </div>
  );

  return (
    <div>
      {preSubmitInfo.customComponent ? (
        preSubmitInfo.customComponent({
          onChange,
          showError,
          preSubmitInfo,
          checked,
          formData,
        })
      ) : (
        <PrivacyAgreementTemplate />
      )}
    </div>
  );
}

PreSubmitSection.propTypes = {
  onChange: PropTypes.func.isRequired,
  preSubmitInfo: PropTypes.object.isRequired,
  showError: PropTypes.bool,
  customComponent: PropTypes.func,
};
