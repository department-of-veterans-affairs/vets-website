import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function TravelPayFilters(props) {
  const {
    statusesToFilterBy,
    checkedStatuses,
    statusFilterChange,
    applyFilters,
    resetSearch,
  } = props;

  return (
    <va-accordion bordered open-single>
      <va-accordion-item
        bordered="true"
        data-testid="filters-accordion"
        header="Filter travel claims"
      >
        <div className="filter-your-results">
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
                  onVaChange={e => statusFilterChange(e, status)}
                />
              </div>
            ))}
          </fieldset>
          <div className="modal-button-wrapper vads-u-margin-top--3">
            <va-button
              onClick={applyFilters}
              data-testid="apply_filters"
              text="Apply filters"
              label="Apply filters"
            />
            <va-button
              onClick={resetSearch}
              data-testid="reset_search"
              text="Reset search"
              label="Reset search"
            />
          </div>
        </div>
      </va-accordion-item>
    </va-accordion>
  );
}

TravelPayFilters.propTypes = {
  applyFilters: PropTypes.func,
  checkedStatuses: PropTypes.array,
  resetSearch: PropTypes.func,
  statusFilterChange: PropTypes.func,
  statusesToFilterBy: PropTypes.array,
};
