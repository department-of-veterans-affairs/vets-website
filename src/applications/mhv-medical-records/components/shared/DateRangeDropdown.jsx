import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CUSTOM_RANGE_VALUE = -1;

function handleChange({ updateDateRangeIndex, callback }) {
  return e => {
    const dateRange = Number(e.detail.value);
    updateDateRangeIndex(dateRange);
    callback(dateRange);
  };
}

const DateRangeDropdown = ({ currentRange, onChange, options, onCustomDateChange, customStartDate, isLoadingData }) => {
  const [dateRangeIndex, updateDateRangeIndex] = useState(currentRange);
  const [showCustomPicker, setShowCustomPicker] = useState(currentRange === CUSTOM_RANGE_VALUE);

  const handleSelectChange = e => {
    const selectedValue = Number(e.detail.value);
    updateDateRangeIndex(selectedValue);
    
    if (selectedValue === CUSTOM_RANGE_VALUE) {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
      onChange(selectedValue);
    }
  };

  const handleCustomDateUpdate = e => {
    if (onCustomDateChange) {
      onCustomDateChange(e.target.value);
    }
  };

  const selectOptions = [
    ...options.map((o, index) => (
      <option
        key={`date-range-${index}`}
        value={o.value}
        className="vads-u-font-weight--normal"
      >
        {o.label}
      </option>
    )),
    <option
      key="custom-range"
      value={CUSTOM_RANGE_VALUE}
      className="vads-u-font-weight--normal"
    >
      Custom date range
    </option>,
  ];

  return (
    <div>
      <VaSelect
        name="date-range-dropdown"
        id="date-range-dropdown"
        label="Select a date range"
        onVaSelect={handleSelectChange}
        className="vads-u-margin-bottom--2 vaos-hide-for-print"
        value={dateRangeIndex.toString()}
        data-testid="date-range-dropdown"
        uswds
      >
        {selectOptions}
      </VaSelect>
      
      {showCustomPicker && (
        <div className="vads-u-margin-top--2">
          <VaDate
            label="Select start date for 90-day range"
            name="custom-date-picker"
            onDateChange={handleCustomDateUpdate}
            value={customStartDate}
            data-testid="custom-date-picker"
          />
          <div className="vads-u-margin-top--2">
            <va-button
              text="View results"
              onClick={() => onChange(CUSTOM_RANGE_VALUE)}
              disabled={isLoadingData || !customStartDate}
              data-testid="custom-date-submit-button"
            />
          </div>
        </div>
      )}
    </div>
  );
};

DateRangeDropdown.propTypes = {
  currentRange: PropTypes.number.isRequired,
  customStartDate: PropTypes.string,
  isLoadingData: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onCustomDateChange: PropTypes.func,
  options: PropTypes.array.isRequired,
};

export default DateRangeDropdown;
