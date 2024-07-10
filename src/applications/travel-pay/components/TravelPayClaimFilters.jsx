import React from 'react';
import PropTypes from 'prop-types';
import TravelPayStatusCheckboxes from './TravelPayStatusCheckboxes';
import TravelPayDateFilterSelect from './TravelPayDateFilterSelect';

export default function TravelPayClaimFilters(props) {
  const {
    statusesToFilterBy,
    checkedStatusFilters,
    onStatusFilterChange,
    applyFilters,
    resetSearch,
    datesToFilterBy,
    selectedDateFilter,
    onDateFilterChange,
  } = props;

  return (
    <va-accordion bordered open-single>
      <va-accordion-item
        bordered="true"
        data-testid="filters-accordion"
        header="Filter travel claims"
      >
        <div className="filter-your-results">
          <TravelPayStatusCheckboxes
            statusesToFilterBy={statusesToFilterBy}
            checkedStatusFilters={checkedStatusFilters}
            onStatusFilterChange={onStatusFilterChange}
          />
          <hr />
          <TravelPayDateFilterSelect
            datesToFilterBy={datesToFilterBy}
            selectedDateFilter={selectedDateFilter}
            onDateFilterChange={onDateFilterChange}
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

TravelPayClaimFilters.propTypes = {
  applyFilters: PropTypes.func,
  checkedStatusFilters: PropTypes.array,
  datesToFilterBy: PropTypes.array,
  resetSearch: PropTypes.func,
  selectedDateFilter: PropTypes.string,
  statusesToFilterBy: PropTypes.array,
  onDateFilterChange: PropTypes.func,
  onStatusFilterChange: PropTypes.func,
};
