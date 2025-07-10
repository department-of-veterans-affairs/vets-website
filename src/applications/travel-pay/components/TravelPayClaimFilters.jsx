import React from 'react';
import PropTypes from 'prop-types';

import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import TravelPayStatusCheckboxes from './TravelPayStatusCheckboxes';

export default function TravelPayClaimFilters(props) {
  const {
    statusesToFilterBy,
    checkedStatusFilters,
    onStatusFilterChange,
    selectedClaimsOrder,
    setSelectedClaimsOrder,
    applyFilters,
    resetSearch,
  } = props;

  return (
    <va-accordion bordered open-single>
      <va-accordion-item
        bordered="true"
        data-testid="filters-accordion"
        header="Filter and sort travel claims"
      >
        <div className="btsss-claims-order-select-container vads-u-margin-bottom--3">
          <VaSelect
            full-width
            hint={null}
            title="Show appointments with travel claims in this order"
            label="Show appointments with travel claims in this order"
            name="claimsOrder"
            id="claimsOrder"
            data-testid="claimsOrder"
            value={selectedClaimsOrder}
            onVaSelect={e => setSelectedClaimsOrder(e.target.value)}
            uswds
          >
            <option value="mostRecent">Most Recent</option>
            <option value="oldest">Oldest</option>
          </VaSelect>
        </div>

        <div className="filter-your-results">
          <TravelPayStatusCheckboxes
            statusesToFilterBy={statusesToFilterBy}
            checkedStatusFilters={checkedStatusFilters}
            onStatusFilterChange={onStatusFilterChange}
          />
          <hr />
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
              secondary
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
  resetSearch: PropTypes.func,
  selectedClaimsOrder: PropTypes.string,
  setSelectedClaimsOrder: PropTypes.func,
  statusesToFilterBy: PropTypes.array,
  onStatusFilterChange: PropTypes.func,
};
