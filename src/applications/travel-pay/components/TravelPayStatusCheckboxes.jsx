import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CLAIMS_STATUSES } from '../util/constants';

export default function TravelPayStatusCheckboxes(props) {
  const {
    statusesToFilterBy,
    checkedStatusFilters,
    onStatusFilterChange,
  } = props;

  return (
    <fieldset>
      <p>Travel claim status</p>
      {statusesToFilterBy.map((status, index) => (
        <div key={index}>
          <VaCheckbox
            checked={checkedStatusFilters.includes(status)}
            data-testid="status-filter"
            name={`${status}_checkbox`}
            key={status}
            label={CLAIMS_STATUSES[status] || status}
            onVaChange={e => onStatusFilterChange(e, status)}
          />
        </div>
      ))}
    </fieldset>
  );
}

TravelPayStatusCheckboxes.propTypes = {
  checkedStatusFilters: PropTypes.array,
  statusesToFilterBy: PropTypes.array,
  onStatusFilterChange: PropTypes.func,
};
