import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

function mapStateToProps() {
  return {};
}
function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Select);
