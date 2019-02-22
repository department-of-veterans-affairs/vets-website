import PropTypes from 'prop-types';
import React from 'react';
import ErrorableCheckbox from './ErrorableCheckbox';

export function PreSubmitSection({ onChange, showError, preSubmitInfo, checked }) {

  return (
    <div>
      {preSubmitInfo.notice}
      {preSubmitInfo.required &&
        <ErrorableCheckbox required
          checked={checked}
          onValueChange={onChange}
          name={preSubmitInfo.field}
          errorMessage={showError && !checked ? (preSubmitInfo.error || 'Please accept') : undefined}
          label={preSubmitInfo.label}/>
      }
    </div>
  );
}

PreSubmitSection.propTypes = {
  onChange: PropTypes.func.isRequired,
  preSubmitInfo: PropTypes.object.isRequired,
  showError: PropTypes.bool
};
