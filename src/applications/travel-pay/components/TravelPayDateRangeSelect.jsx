import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function TravelPayDateRangeSelect(props) {
  const { availableDateRanges, selectedDateRange, onDateRangeChange } = props;

  return (
    <VaSelect
      hint={null}
      label="Select date range"
      title="Select date range"
      name="claimsDates"
      data-testid="claimsDates"
      value={JSON.stringify(selectedDateRange)}
      onVaSelect={e => onDateRangeChange(e)}
      uswds
    >
      {availableDateRanges.map(date => (
        <option key={date.value} value={JSON.stringify(date)}>
          {date.label}
        </option>
      ))}
    </VaSelect>
  );
}

TravelPayDateRangeSelect.propTypes = {
  availableDateRanges: PropTypes.arrayOf(PropTypes.object),
  selectedDateRange: PropTypes.object,
  onDateRangeChange: PropTypes.func,
};
