import PropTypes from 'prop-types';
import React from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

export function PreSubmitSection({
  termsAccepted,
  showError,
  preSubmitInfo,
  checked,
}) {
  return (
    <div>
      {preSubmitInfo.notice}
      {preSubmitInfo.required && (
        <ErrorableCheckbox
          required
          checked={checked}
          onValueChange={termsAccepted}
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
}

PreSubmitSection.propTypes = {
  termsAccepted: PropTypes.func.isRequired,
  preSubmitInfo: PropTypes.object.isRequired,
  showError: PropTypes.bool,
};
