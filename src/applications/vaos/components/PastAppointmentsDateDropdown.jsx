import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function PastAppointmentsDateDropdown({
  currentRange,
  onChange,
  options,
}) {
  const [dateRangeIndex, updateDateRangeIndex] = useState(currentRange);
  return (
    <div className="vads-u-margin-bottom--3">
      <label
        className="vads-u-display--inline-block vads-u-font-weight--bold vads-u-margin-top--0 vads-u-margin-right--2"
        htmlFor="options"
      >
        Select a date range{' '}
        <span className="sr-only">for your appointments</span>
      </label>
      <select
        className="usa-select usa-select vads-u-display--inline-block vads-u-width--auto"
        name="options"
        id="options"
        value={dateRangeIndex}
        onChange={e => updateDateRangeIndex(Number(e.target.value))}
      >
        {options.map((o, index) => (
          <option key={`date-range-${index}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="vads-u-display--inline-block vads-u-margin-left--2"
        aria-label="Update my appointments list"
        disabled={currentRange === dateRangeIndex}
        onClick={() => {
          onChange(dateRangeIndex);
        }}
      >
        Update
      </button>
    </div>
  );
}

PastAppointmentsDateDropdown.propTypes = {
  currentRange: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};
