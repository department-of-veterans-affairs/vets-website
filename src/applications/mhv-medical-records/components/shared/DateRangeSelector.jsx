import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * DateRangeSelector Component
 * A dropdown selector for date ranges including predefined month options (3, 6 months)
 * and dynamically generated year options from 2013 to current year.
 */

const currentYear = new Date().getFullYear();
const yearsDescending = Array.from({ length: currentYear - 2012 }, (_, i) =>
  String(currentYear - i),
);

/**
 * Default date range options
 * Includes 3 months, 6 months, and years from current year back to 2013
 */
export const dateRangeList = [
  { value: '3', label: 'Last 3 months' },
  { value: '6', label: 'Last 6 months' },
  ...yearsDescending.map(year => ({
    value: year,
    label: `All of ${year}`,
  })),
];

const DateRangeSelector = ({
  domain,
  dateOptions = dateRangeList,
  selectedDate,
  onDateRangeSelect,
}) => {
  return (
    <VaSelect
      label={`Select date range for ${domain} results`}
      name="dateRangeSelector"
      value={selectedDate}
      onVaSelect={onDateRangeSelect}
      data-testid="date-range-selector"
    >
      {dateOptions.map(date => (
        <option key={date.value} value={date.value}>
          {date.label}
        </option>
      ))}
    </VaSelect>
  );
};

DateRangeSelector.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  onDateRangeSelect: PropTypes.func.isRequired,
  dateOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

export default DateRangeSelector;
