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
        <div key={input.id} className="vads-u-margin-y--2">
          <va-number-input
            label={input.name}
            name={input.name}
            value={input.amount}
            id={input.name + key}
            error={
              submitted && errorList.includes(input.name)
                ? 'Enter valid dollar amount'
                : ''
            }
            inputmode="decimal"
            onInput={onChange}
            required
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
