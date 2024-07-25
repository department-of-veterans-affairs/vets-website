import React from 'react';
import PropTypes from 'prop-types';

export default function TravelPayDateFilterSelect(props) {
  const { datesToFilterBy, selectedDateFilter, onDateFilterChange } = props;

  return (
    <>
      <label htmlFor="claimsOrder" className="vads-u-margin-bottom--0">
        Select a date range
      </label>
      <select
        hint={null}
        title="Select a date range"
        name="claimsDates"
        data-testid="claimsDates"
        value={selectedDateFilter}
        onChange={onDateFilterChange}
      >
        <option value="all">All</option>
        {datesToFilterBy.map(date => (
          <option key={date.label} value={date.label}>
            {date.label}
          </option>
        ))}
      </select>
    </>
  );
}

TravelPayDateFilterSelect.propTypes = {
  datesToFilterBy: PropTypes.array,
  selectedDateFilter: PropTypes.string,
  onDateFilterChange: PropTypes.func,
};
