import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function handleChange({ updateDateRangeIndex, callback }) {
  return e => {
    const dateRange = Number(e.detail.value);
    updateDateRangeIndex(dateRange);
    callback(dateRange);
  };
}

const DateRangeDropdown = ({ currentRange, onChange, options }) => {
  const [dateRangeIndex, updateDateRangeIndex] = useState(currentRange);

  const selectOptions = options.map((o, index) => {
    return (
      <option
        key={`date-range-${index}`}
        value={o.value}
        className="vads-u-font-weight--normal"
      >
        {o.label}
      </option>
    );
  });

  return (
    <VaSelect
      name="date-range-dropdown"
      id="date-range-dropdown"
      label="Select a date range"
      onVaSelect={handleChange({
        currentRange,
        dateRangeIndex,
        updateDateRangeIndex,
        callback: onChange,
      })}
      className="vads-u-margin-bottom--2 vaos-hide-for-print"
      value={dateRangeIndex.toString()}
      data-testid="date-range-dropdown"
      uswds
    >
      {selectOptions}
    </VaSelect>
  );
};

DateRangeDropdown.propTypes = {
  currentRange: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default DateRangeDropdown;
