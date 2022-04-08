import React from 'react';

export default function YesNoWidget({
  id,
  value,
  disabled,
  onChange,
  options = {},
}) {
  const {
    yesNoReverse = false,
    labels = {},
    widgetProps = {},
    selectedProps = {},
  } = options;

  const values = {
    Y: !yesNoReverse,
    N: yesNoReverse,
  };

  const getProps = key => ({
    ...(widgetProps[key] || {}),
    ...((value === values[key] && selectedProps[key]) || {}),
  });

  return (
    <div className="form-radio-buttons">
      <input
        type="radio"
        checked={value === values.Y}
        autoComplete="off"
        id={`${id}Yes`}
        name={`${id}`}
        value="Y"
        disabled={disabled}
        onChange={_ => onChange(values.Y)}
        {...getProps('Y')}
      />
      <label htmlFor={`${id}Yes`}>{labels.Y || 'Yes'}</label>
      <input
        type="radio"
        checked={value === values.N}
        autoComplete="off"
        id={`${id}No`}
        name={`${id}`}
        value="N"
        disabled={disabled}
        onChange={_ => onChange(values.N)}
        {...getProps('N')}
      />
      <label htmlFor={`${id}No`}>{labels.N || 'No'}</label>
    </div>
  );
}
