import React from 'react';
import classNames from 'classnames';

const CalendarCheckboxOption = ({
  checked,
  disabled,
  fieldName,
  id,
  label,
  onChange,
  value,
}) => {
  const divClasses = classNames('vaos-calendar__option', {
    disabled,
  });

  const labelClasses = classNames(
    'vads-u-margin--0',
    'vads-u-font-weight--bold',
    {
      'vads-u-color--primary': !disabled,
      'vads-u-color--gray-lighter': disabled,
    },
  );

  return (
    <div className={divClasses}>
      <input
        id={`checkbox-${id}`}
        type="checkbox"
        name={fieldName}
        value={value}
        checked={checked}
        onClick={onChange}
        onChange={onChange}
      />
      <label className={labelClasses} htmlFor={`checkbox-${id}`}>
        {label}
      </label>
    </div>
  );
};

export default CalendarCheckboxOption;
