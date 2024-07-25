import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function TravelPayDateFilterSelect(props) {
  const { datesToFilterBy, selectedDateFilter, onDateFilterChange } = props;

  return (
    <VaSelect
      hint={null}
      label="Filter by date range"
      title="Select date range"
      name="claimsDates"
      data-testid="claimsDates"
      value={selectedDateFilter}
      onVaSelect={e => onDateFilterChange(e)}
      uswds
    >
      <option value="all">All</option>
      {datesToFilterBy.map(date => (
        <option key={date.label} value={date.label}>
          {date.label}
        </option>
      ))}
    </VaSelect>
  );
}

TravelPayDateFilterSelect.propTypes = {
  datesToFilterBy: PropTypes.array,
  selectedDateFilter: PropTypes.string,
  onDateFilterChange: PropTypes.func,
};
