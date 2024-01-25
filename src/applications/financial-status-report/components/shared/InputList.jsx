import React from 'react';
import PropTypes from 'prop-types';

const InputList = ({
  errorList,
  inputs,
  prompt = '',
  submitted,
  title = '',
  onChange,
  min,
  max,
}) => {
  return (
    <fieldset className="vads-u-margin-y--2">
      {title && (
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">{title}</h3>
          {prompt && (
            <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-padding-bottom--0p25 vads-u-margin-top--3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
              {prompt}
            </p>
          )}
        </legend>
      )}
      {inputs?.map((input, key) => (
        <div key={input.name + key}>
          <va-number-input
            error={
              submitted && errorList.includes(input.name)
                ? `Please enter a valid amount below $${max}`
                : ''
            }
            id={input.name + key}
            inputmode="decimal"
            label={input.name}
            name={input.name}
            onInput={onChange}
            required
            value={input.amount}
            min={min}
            max={max}
            width="md"
            currency
            uswds
          />
        </div>
      ))}
    </fieldset>
  );
};

InputList.propTypes = {
  errorList: PropTypes.arrayOf(PropTypes.string),
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      amount: PropTypes.string,
      id: PropTypes.string,
    }),
  ),
  prompt: PropTypes.string,
  submitted: PropTypes.bool,
  title: PropTypes.string,
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default InputList;
