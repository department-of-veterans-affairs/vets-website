import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export function TargetCheckboxWidget({
  id,
  value,
  required,
  disabled,
  label,
  onChange,
  options,
}) {
  const requiredSpan = required ? (
    <span className="form-required-span">(*Required)</span>
  ) : null;
  const widgetClasses = classNames('form-checkbox', options.widgetClassNames);
  return (
    <div className={widgetClasses}>
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={typeof value === 'undefined' ? false : value}
        required={required}
        disabled={disabled}
        onChange={event => onChange(event.target)}
      />
      <label className="schemaform-label" htmlFor={id}>
        {options.title || label}
        {requiredSpan}
      </label>
    </div>
  );
}

TargetCheckboxWidget.defaultProps = {
  autofocus: false,
};

TargetCheckboxWidget.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  options: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
