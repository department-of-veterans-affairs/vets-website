import PropTypes from 'prop-types';
import React from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

export function PreSubmitSection({
  sectionCompleted,
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
          onValueChange={sectionCompleted}
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
  sectionCompleted: PropTypes.func.isRequired,
  preSubmitInfo: PropTypes.shape({
    CustomComponent: PropTypes.func || PropTypes.element,
    error: PropTypes.string,
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    notice: PropTypes.element || PropTypes.string,
    required: PropTypes.bool,
  }).isRequired,
  showError: PropTypes.bool,
};
