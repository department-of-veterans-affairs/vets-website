import React from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckbox,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function TravelPayStatusCheckboxes(props) {
  const {
    statusesToFilterBy,
    checkedStatusFilters,
    onStatusFilterChange,
  } = props;

  return (
    <VaCheckboxGroup
      id="status-checkboxes"
      name="status-filter"
      label="Filter by status"
      onVaChange={e => onStatusFilterChange(e)}
      uswds
    >
      {statusesToFilterBy.map(status => (
        <VaCheckbox
          checked={checkedStatusFilters.includes(status)}
          data-testid={`status-filter_${status}`}
          name={status}
          key={status}
          label={status}
          uswds
        />
      ))}
    </VaCheckboxGroup>
  );
}

TravelPayStatusCheckboxes.propTypes = {
  checkedStatusFilters: PropTypes.array,
  statusesToFilterBy: PropTypes.array,
  onStatusFilterChange: PropTypes.func,
};
