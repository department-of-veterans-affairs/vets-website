import React from 'react';
import PropTypes from 'prop-types';

const PastAppointmentsDateDropdown = ({ value, onChange, options }) => (
  <div>
    <label htmlFor="options">Go to:</label>
    <select
      className="usa-select"
      name="options"
      id="options"
      value={value}
      onChange={onChange}
    >
      {options.map((o, index) => (
        <option key={`date-range-${index}`} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

PastAppointmentsDateDropdown.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default PastAppointmentsDateDropdown;
