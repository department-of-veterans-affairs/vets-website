import PropTypes from 'prop-types';
import React from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

export function PreSubmitSection({
  onSectionComplete,
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
          onValueChange={onSectionComplete}
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
  onSectionComplete: PropTypes.func.isRequired,
  preSubmitInfo: PropTypes.shape({
    CustomComponent: PropTypes.func,
    error: PropTypes.string,
    field: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    notice: PropTypes.element,
    required: PropTypes.bool,
  }).isRequired,
  showError: PropTypes.bool,
};
