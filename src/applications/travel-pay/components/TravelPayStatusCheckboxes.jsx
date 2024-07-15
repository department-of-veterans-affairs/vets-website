import React from 'react';
import PropTypes from 'prop-types';
import { CLAIMS_STATUSES } from '../util/constants';

export default function TravelPayStatusCheckboxes(props) {
  const {
    statusesToFilterBy,
    checkedStatusFilters,
    onStatusFilterChange,
  } = props;

  return (
    <va-checkbox-group
      id="status-checkboxes"
      name="status-filter"
      label="Filter by status"
      uswds
    >
      {statusesToFilterBy.map(status => (
        <va-checkbox
          checked={checkedStatusFilters.includes(status)}
          data-testid="status-filter"
          name="status-filter"
          key={status}
          value={status}
          label={CLAIMS_STATUSES[status] || status}
          onVaChange={e => onStatusFilterChange(e, status)}
          uswds
        />
      ))}
    </va-checkbox-group>
  );
}

TravelPayStatusCheckboxes.propTypes = {
  checkedStatusFilters: PropTypes.array,
  statusesToFilterBy: PropTypes.array,
  onStatusFilterChange: PropTypes.func,
};
