import React from 'react';
import PropTypes from 'prop-types';

/*
 * This is a copy of the form system RadioWidget, but with custom
 * code to disable certain options. This isn't currently supported by the
 * form system.
 */
export default function AppointmentsRadioWidget({
  id,
  options,
  value,
  onChange,
  required,
}) {
  const { enumOptions, labels, descriptions } = options;

  return (
    <div>
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
              <label htmlFor={`${id}_${i}`}>
                {labels ? labels[option.value] : option.label}
                {descriptions && (
                  <span className="vaos-radio__label-description">
                    {descriptions[option.value]}
                  </span>
                )}
              </label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}
AppointmentsRadioWidget.propTypes = {
  formContext: PropTypes.object,
  id: PropTypes.string,
  options: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
