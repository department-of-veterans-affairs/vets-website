import React from 'react';
import PropTypes from 'prop-types';

const InputList = ({
  errorList,
  inputs,
  prompt = '',
  submitted,
  title = '',
  onChange,
}) => {
  return (
    <div>
      <legend className="schemaform-block-title">{title}</legend>
      <p>{prompt}</p>
      {inputs?.map((input, key) => (
        <div key={input.name + key} className="vads-u-margin-y--2">
          <va-number-input
            className="no-wrap input-size-3"
            error={
              submitted && errorList.includes(input.name)
                ? 'Enter valid dollar amount'
                : ''
            }
            id={input.name + key}
            inputmode="decimal"
            label={input.name}
            name={input.name}
            onInput={onChange}
            required
            value={input.amount}
            currency
          />
        </div>
      ))}
    </div>
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
};

export default InputList;
