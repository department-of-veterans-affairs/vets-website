import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function TravelPayStatusFilters(props) {
  const { statusesToFilterBy, checkedStatuses, onStatusFilterChange } = props;

  return (
    <fieldset>
      <p>Travel claim status</p>
      {statusesToFilterBy.map((status, index) => (
        <div key={index}>
          <VaCheckbox
            checked={checkedStatuses.includes(status)}
            data-testid="status-filter"
            name={`${status}_checkbox`}
            key={status}
            label={status}
            onVaChange={e => onStatusFilterChange(e, status)}
          />
        </div>
      ))}
    </fieldset>
  );
}

TravelPayStatusFilters.propTypes = {
  checkedStatuses: PropTypes.array,
  statusesToFilterBy: PropTypes.array,
  onStatusFilterChange: PropTypes.func,
};
