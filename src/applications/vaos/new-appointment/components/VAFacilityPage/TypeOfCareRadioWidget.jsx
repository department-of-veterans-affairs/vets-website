import React from 'react';
import PropTypes from 'prop-types';

/*
 * This is a copy of the form system RadioWidget, but with custom
 * code to disable certain options. This isn't currently supported by the
 * form system.
 */
export default function TypeOfCareRadioWidget({
  id,
  options,
  value,
  onChange,
  required,
}) {
  const { enumOptions } = options;

  return (
    <div className="vads-u-margin-top--3">
      <fieldset>
        <legend className="sr-only">
          {options.title} {required ? 'required' : ''}
        </legend>

        {enumOptions.map((option, i) => {
          const checked = option.value === value;

          return (
            <div className="form-radio-buttons" key={option.value}>
              <input
                type="radio"
                checked={checked}
                autoComplete="off"
                id={`${id}_${i}`}
                name={id}
                value={value}
                onChange={_ => onChange(option.value)}
              />
              <label htmlFor={`${id}_${i}`}>{option.label}</label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}
TypeOfCareRadioWidget.propTypes = {
  formContext: PropTypes.object,
  id: PropTypes.string,
  options: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
