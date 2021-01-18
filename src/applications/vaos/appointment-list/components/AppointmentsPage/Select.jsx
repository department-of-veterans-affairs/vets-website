import React from 'react';
import PropTypes from 'prop-types';

function Select({ onChange, ariaLabelledBy, options }) {
  return (
    <>
      <select
        id="options"
        name="options"
        className="usa-select vads-u-margin-bottom--6"
        onChange={onChange}
        aria-labelledby={ariaLabelledBy}
      >
        {options.map((o, index) => (
          <option key={`selected-${index}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </>
  );
}

Select.propTypes = {
  past: PropTypes.array,
  pastStatus: PropTypes.string,
  pastSelectedIndex: PropTypes.number,
  facilityData: PropTypes.object,
  fetchPastAppointments: PropTypes.func,
  showPastAppointments: PropTypes.bool,
};

export default Select;
