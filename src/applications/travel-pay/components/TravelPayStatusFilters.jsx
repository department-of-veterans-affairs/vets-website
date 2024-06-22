import React from 'react';
import PropTypes from 'prop-types';
import TravelPayStatusCheckboxes from './TravelPayStatusCheckboxes';

export default function TravelPayFilters(props) {
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

  // console.log(datesToFilterBy); // eslint-disable-line no-console

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
          <label htmlFor="claimsOrder" className="vads-u-margin-bottom--0">
            Show appointments in this order
          </label>
          <select
            hint={null}
            title="Select a date range"
            name="claimsDates"
            id="claimsDates"
            value={selectedDateFilter}
            onChange={onDateFilterChange}
          >
            <option value="all">All</option>
            {datesToFilterBy.map(date => (
              <option key={date.label} value={date.label}>
                {date.label}
              </option>
            ))}
            {/* <option value="mostRecent">Most Recent</option>
            <option value="oldest">Oldest</option> */}
          </select>
          {/* </div> */}
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
  checkedStatusFilters: PropTypes.array,
  datesToFilterBy: PropTypes.array,
  resetSearch: PropTypes.func,
  selectedDateFilter: PropTypes.string,
  statusesToFilterBy: PropTypes.array,
  onDateFilterChange: PropTypes.func,
  onStatusFilterChange: PropTypes.func,
};
