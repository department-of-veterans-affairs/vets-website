import React from 'react';
import PropTypes from 'prop-types';

function Select({ onChange, options, id }) {
  return (
    <select
      id={id}
      name={id}
      className="usa-select vads-u-margin-bottom--6"
      onChange={onChange}
    >
      {options.map((o, index) => (
        <option key={`selected-${index}`} value={o.value}>
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
