import PropTypes from 'prop-types';
import React from 'react';

export default function CheckboxWidget({
  id,
  value,
  required,
  disabled,
  label,
  autofocus,
  onChange,
  options
}) {
  const requiredSpan = required ? <span className="form-required-span">*</span> : null;
  return (
    <div className="form-checkbox">
      <input type="checkbox"
          id={id}
          name={id}
          checked={typeof value === 'undefined' ? false : value}
          required={required}
          disabled={disabled}
          autoFocus={autofocus}
          onChange={(event) => onChange(event.target.checked)}/>
      <label className="schemaform-label" htmlFor={id}>
        {options.title || label}{requiredSpan}
      </label>
    </div>
  );
}

CheckboxWidget.defaultProps = {
  autofocus: false,
};

CheckboxWidget.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.bool,
  required: PropTypes.bool,
  autofocus: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  options: PropTypes.object,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};
