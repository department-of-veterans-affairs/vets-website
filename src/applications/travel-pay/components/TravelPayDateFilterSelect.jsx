import React from 'react';
import PropTypes from 'prop-types';

export default function TravelPayDateFilterSelect(props) {
  const { datesToFilterBy, selectedDateFilter, onDateFilterChange } = props;

  return (
    <>
      <va-select
        hint={null}
        label="Filter by date range"
        name="claimsDates"
        data-testid="claimsDates"
        value={selectedDateFilter}
        onChange={onDateFilterChange}
        uswds
      >
        <option value="all">All</option>
        {datesToFilterBy.map(date => (
          <option key={date.label} value={date.label}>
            {date.label}
          </option>
        ))}
      </va-select>
    </>
  );
}

TravelPayDateFilterSelect.propTypes = {
  datesToFilterBy: PropTypes.array,
  selectedDateFilter: PropTypes.string,
  onDateFilterChange: PropTypes.func,
};
