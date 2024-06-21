import React from 'react';
import PropTypes from 'prop-types';
import TravelPayStatusFilters from './TravelPayStatusFilters';

export default function TravelPayFilters(props) {
  const {
    statusesToFilterBy,
    checkedStatuses,
    onStatusFilterChange,
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
          <TravelPayStatusFilters
            statusesToFilterBy={statusesToFilterBy}
            checkedStatuses={checkedStatuses}
            onStatusFilterChange={onStatusFilterChange}
          />
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
  statusesToFilterBy: PropTypes.array,
  onStatusFilterChange: PropTypes.func,
};
