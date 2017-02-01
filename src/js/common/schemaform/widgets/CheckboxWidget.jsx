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
          checked={typeof value === 'undefined' ? false : value}
          required={required}
          disabled={disabled}
          autoFocus={autofocus}
          onChange={(event) => onChange(event.target.checked)}/>
      <label htmlFor={id}>
        {options.title || label}{requiredSpan}
      </label>
    </div>
  );
}

CheckboxWidget.defaultProps = {
  autofocus: false,
};

CheckboxWidget.propTypes = {
  id: React.PropTypes.string.isRequired,
  value: React.PropTypes.bool,
  required: React.PropTypes.bool,
  autofocus: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  disabled: React.PropTypes.bool,
  options: React.PropTypes.object,
  label: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ])
};
