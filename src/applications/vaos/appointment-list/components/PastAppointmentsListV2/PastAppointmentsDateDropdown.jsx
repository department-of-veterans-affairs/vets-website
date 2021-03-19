import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from '../../../components/Select';

/**
 * React component used to render past appointment date dropdown.
 *
 * @component
 * <PastAppointmentsDateDropdown
 *  currentRange=[]
 *  onChange={givenOnChangeFunction}
 *  options=[]
 * />
 *
 * @category Appointment List
 * @subcategory Past Appointments List V2
 * @module PastAppointmentsDateDropdown
 */
export default function PastAppointmentsDateDropdown({
  currentRange,
  onChange,
  options,
}) {
  const [dateRangeIndex, updateDateRangeIndex] = useState(currentRange);
  return (
    <>
      <label
        htmlFor="type-dropdown"
        className="vads-u-display--inline-block vads-u-margin-top--0 vads-u-margin-right--2 vads-u-margin-bottom--0"
      >
        Select a date range{' '}
        <span className="sr-only">for your appointments</span>
      </label>
      <Select
        options={options}
        onChange={e => updateDateRangeIndex(Number(e.target.value))}
        id="type-dropdown"
        value={dateRangeIndex}
      />
      <button
        type="button"
        aria-label="Update my appointments list"
        className="usa-button"
        onClick={() => {
          if (currentRange !== dateRangeIndex) {
            onChange(dateRangeIndex);
          }
        }}
      >
        Update
      </button>
    </>
  );
}

PastAppointmentsDateDropdown.propTypes = {
  /**
   * Date Range
   */
  currentRange: PropTypes.number.isRequired,
  /**
   * A function that’s called when onChange called
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Dropdown Options Array
   */
  options: PropTypes.array.isRequired,
};
