import React from 'react';
import PropTypes from 'prop-types';

const PastAppointmentsDateDropdown = ({ value, onChange }) => (
  <div>
    <label htmlFor="options">Dropdown label</label>
    <select
      className="usa-select"
      name="options"
      id="options"
      value={value}
      onChange={onChange}
    >
      <option value>- Select -</option>
      <option value="value1">Option A</option>
      <option value="value2">Option B</option>
      <option value="value3">Option C</option>
    </select>
  </div>
);

PastAppointmentsDateDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PastAppointmentsDateDropdown;
