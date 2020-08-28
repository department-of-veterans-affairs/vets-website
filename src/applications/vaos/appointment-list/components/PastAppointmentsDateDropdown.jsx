import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';

export default function PastAppointmentsDateDropdown({
  currentRange,
  onChange,
  options,
}) {
  const [dateRangeIndex, updateDateRangeIndex] = useState(currentRange);
  return (
    <div className="vads-u-display--flex vads-u-margin-bottom--3 small-screen:vads-u-align-items--center vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
      <label
        className="vads-u-display--inline-block vads-u-font-weight--bold vads-u-margin-top--0 vads-u-margin-right--2"
        htmlFor="options"
      >
        Select a date range{' '}
        <span className="sr-only">for your appointments</span>
      </label>
      <select
        className="usa-select small-screen:vads-u-width--auto small-screen:vads-u-margin-right--2"
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
        aria-label="Update my appointments list"
        onClick={() => {
          if (currentRange !== dateRangeIndex) {
            onChange(dateRangeIndex);
          } else {
            focusElement('#queryResultLabel');
          }
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
