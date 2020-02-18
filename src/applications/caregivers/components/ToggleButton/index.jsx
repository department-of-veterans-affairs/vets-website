import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function ToggleButton({
  disabled,
  id,
  label,
  onChange,
  options,
  required,
}) {
  const requiredSpan = required ? (
    <span className="form-required-span">(*Required)</span>
  ) : null;

  const widgetClasses = classNames(
    'caregiver-toggleButton',
    options.widgetClassNames,
  );

  const [isTruthy, setToggle] = useState(false);
  return (
    <div className={widgetClasses}>
      {requiredSpan}
      <button
        type="button"
        id={id}
        name={id}
        disabled={disabled}
        onClick={() => {
          onChange(!isTruthy);
          setToggle(!isTruthy);
        }}
      >
        {options.label || options.title || label}
      </button>
    </div>
  );
}

ToggleButton.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  options: PropTypes.object,
  required: PropTypes.bool,
};
