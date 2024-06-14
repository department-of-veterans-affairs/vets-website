import React from 'react';
import PropTypes from 'prop-types';

const Checklist = ({
  options,
  onChange,
  isBoxChecked,
  prompt = '',
  title = '',
}) => {
  return (
    <fieldset className="checkbox-list vads-u-margin-y--2">
      <legend className="schemaform-block-title">
        {title ? <h3 className="vads-u-margin--0">{title}</h3> : null}
        {prompt ? (
          <p className="vads-u-margin-bottom--0p5 vads-u-margin-top--3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
            {prompt}
          </p>
        ) : null}
      </legend>
      {options?.map((option, key) => (
        <div key={option + key} className="checkbox-list-item">
          <input
            type="checkbox"
            id={option + key}
            name={option}
            value={option}
            checked={isBoxChecked(option)}
            onChange={onChange}
          />
          <label className="vads-u-margin-y--2" htmlFor={option + key}>
            {option}
          </label>
        </div>
      ))}
    </fieldset>
  );
};

Checklist.propTypes = {
  isBoxChecked: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
  prompt: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.func,
};

export default Checklist;
