import React from 'react';
import PropTypes from 'prop-types';

function Select({ onChange, options, id, value }) {
  return (
    <select
      id={id}
      name={id}
      className="usa-select vads-u-margin-bottom--1p5"
      onChange={onChange}
      value={value}
    >
      {options.map((o, index) => (
        <option
          key={`selected-${index}`}
          value={o.value}
          className="vads-u-font-weight--normal"
        >
          {o.label}
        </option>
      ))}
    </select>
  );
}

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
};

export default Select;
