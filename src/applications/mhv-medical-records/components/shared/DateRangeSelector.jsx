import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Returns date range options including 3 months, 6 months, and years from 2013 to current year
 */
export const getDateRangeList = () => {
  const currentYear = new Date().getFullYear();
  const yearsDescending = Array.from({ length: currentYear - 2012 }, (_, i) =>
    String(currentYear - i),
  );
  return [
    { value: '3', label: 'Last 3 months' },
    { value: '6', label: 'Last 6 months' },
    ...yearsDescending.map(year => ({
      value: year,
      label: `All of ${year}`,
    })),
  ];
};

/**
 * DateRangeSelector Component
 * A dropdown selector for date ranges including predefined month options (3, 6 months)
 * and dynamically generated year options from 2013 to current year.
 *
 * @param {Object} props - Component props
 * @param {string} props.selectedDate - Currently selected date range value
 * @param {Function} props.onDateRangeSelect - Callback fired on vaSelect event with event.detail.value
 * @param {Array} [props.dateOptions] - Optional custom date range options array
 * @param {boolean} [props.isLoading] - Optional inert prop for VaSelect read only purposes
 *
 * @returns {JSX.Element} Date range selector dropdown
 */
const DateRangeSelector = ({
  dateOptions = getDateRangeList(),
  selectedDate,
  onDateRangeSelect,
  isLoading,
}) => {
  // Only apply the inert attribute when loading accelerated data to avoid always-present attribute.
  const selectRef = useRef(null);
  const selectProps = {
    label: 'Date range',
    name: 'dateRangeSelector',
    value: selectedDate,
    onVaSelect: onDateRangeSelect,
    'data-testid': 'date-range-selector',
    ref: selectRef,
  };
  if (isLoading) {
    selectProps.inert = true;
  }

  // Defensive cleanup: some browsers / web component wrappers may retain the inert
  // attribute after prop removal. Explicitly remove it when loading stops.
  useEffect(
    () => {
      if (isLoading) {
        return; // nothing to clean while still loading
      }
      const el =
        selectRef.current ||
        document.querySelector('[data-testid="date-range-selector"]');
      if (el?.hasAttribute('inert')) {
        el.removeAttribute('inert');
      }
    },
    [isLoading],
  );

  return (
    <VaSelect {...selectProps}>
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
  onDateRangeSelect: PropTypes.func.isRequired,
  dateOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  isLoading: PropTypes.bool,
};

export default DateRangeSelector;
